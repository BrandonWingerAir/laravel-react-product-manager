<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\User;
use JWTAuth;
use JWTAuthException;

class UserController extends Controller
{
    private function getToken($email, $password)
    {
        $token = null;

        try {
            if (!$token = JWTAuth::attempt(['email' => $email, 'password' => $password])) {
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

    public function login(Request $request)
    {
        $user = \App\User::where('email', $request->email)->get()->first();

        if ($user && \Hash::check($request->password, $user->password))
        {
            $token = self::getToken($request->email, $request->password);
            $user->auth_token = $token;
            $user->token_expire = $request->token_expire;
            $user->save();
            $response = ['success' => true, 'data' => [
                'id' => $user->id, 
                'auth_token' => $user->auth_token,
                'token_expire' => $user->token_expire,
                'name' => $user->name,
                'email' => $user->email,
            ]];
        }
        else
            $response = ['success' => false, 'data' => 'Record does not exist'];

        return response()->json($response, 201);
    }

    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|max:30|unique:users',
            'email' => 'required|max:255|email|unique:users'
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => 'Username or email already registered!'], 422);
        }

        $payload = [
            'password' => \Hash::make($request->password),
            'email' => $request->email,
            'name' => $request->name,
            'auth_token' => '',
            'token_expire' => $request->token_expire
        ];

        $user = new \App\User($payload);

        if ($user->save())
        {
            $token = self::getToken($request->email, $request->password);

            if (!is_string($token))
                return response()->json(['success' => false, 'data' => 'Token generation failed'], 201);

            $user = \App\User::where('email', $request->email)->get()->first();
            $user->auth_token = $token;
            $user->save();
            
            $response = [
                ['success' => true, 'data' => [
                    'name' => $user->name, 'id' => $user->id, 'email' => $request->email, 'auth_token' => $token, 'token_expire' => $user->token_expire
                ]]
            ];
        }
        else 
            $response = ['success' => false, 'data' => 'Could not register user'];

        return response()->json($response, 201);
    }

    public function logout() {
        auth()->logout();

        return response()->json(['message' => 'Successfully logged out']);
    }
}
