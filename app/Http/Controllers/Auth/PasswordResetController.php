<?php
  namespace App\Http\Controllers\Auth;
  
  use App\Http\Controllers\Controller;
  use Illuminate\Http\Request;
  use Illuminate\Support\Facades\Validator;
  use Carbon\Carbon;
  use App\Notifications\PasswordResetRequest;
  use App\Notifications\PasswordResetSuccess;
  use App\User;
  use App\PasswordReset;
  use JWTAuth;
  

  class PasswordResetController extends Controller
  {
      private function getToken($user)
      {
          $token = null;

          try {
              if (!$token = JWTAuth::fromUser($user)) {
                  return response()->json([
                      'response' => 'error',
                      'message' => 'Password or email is invalid',
                      'token' => $token
                  ]);
              }
          } catch (JWTAuthException $e) {
              return response()->json([
                  'response' => 'error',
                  'message' => 'Token create failed',
              ]);
          }

          return $token;
      }

      /**
       * Create token password reset
       *
       * @param  [string] email
       * @return [string] message
       */
      public function create(Request $request)
      {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email|exists:users',
        ]);

        if ($validator->fails()) {
          return response()->json(['errors' => $validator->errors(), 'error' => 'Form data invalid!'], 422);
        }
        
        $user = User::where('email', $request->email)->first(); 

        if (!$user)
          return response()->json([
              'message' => 'We can\'t find a user with that e-mail address.'
          ], 404);
            
        $passwordReset = PasswordReset::updateOrCreate(
          [
            'email' => $user->email,
            'token' => str_random(60)
          ]
        );        
        
        if ($user && $passwordReset)
          $user->notify(
              new PasswordResetRequest($passwordReset->token)
          );

        return response()->json([
            'success' => true,
            'message' => 'We have e-mailed your password reset link!'
        ]);
      }
      
      /**
        * Find token password reset
        *
        * @param  [string] $token
        * @return [string] message
        * @return [json] passwordReset object
        */
      public function find($token)
      {
        $passwordReset = PasswordReset::where('token', $token)->first();      
        
        if (!$passwordReset)
          return response()->json([
              'message' => 'This password reset token is invalid.'
          ], 404);        
          
        if (Carbon::parse($passwordReset->updated_at)->addMinutes(720)->isPast()) {
          $passwordReset->delete();
          
          return response()->json([
              'message' => 'This password reset token is invalid.'
          ], 404);
        }
        
        return response()->json([
          "success" => true,
          "user" => $passwordReset
        ]);
      }
      
      /**
      * Reset password
      *
      * @param  [string] email
      * @param  [string] password
      * @param  [string] password_confirmation
      * @param  [string] token
      * @return [string] message
      * @return [json] user object
      */
      public function reset(Request $request)
      {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'password' => 'required|string|min:8|confirmed',
            'token' => 'required|string'
        ]);
        
        if ($validator->fails()) {
          return response()->json(['errors' => $validator->errors(), 'error' => 'Form data invalid!'], 422);
        }
        
        $passwordReset = PasswordReset::where([
            ['token', $request->token],
            ['email', $request->email]
        ])->first();        
        
        if (!$passwordReset)
          return response()->json([
              'message' => 'This password reset token is invalid.'
          ], 404);
          
        $user = User::where('email', $passwordReset->email)->first();
        
        if ($user) {
          $token = self::getToken($user);

          $user->auth_token = $token;
          $user->token_expire = $request->token_expire;
          $user->password = bcrypt($request->password);

          $user->save();        

          $passwordReset->delete();

          $user->notify(new PasswordResetSuccess($passwordReset));        
          
          return response()->json([
            'success' => true,
            'user' => $user
          ]);
        } else {
          return response()->json([
            'message' => 'We can\t find a user with that e-mail address.'
          ], 404);
        }
      }
  }