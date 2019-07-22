<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route::middleware('auth:api')->get('/user', function (Request $request) {
//     return $request->user();
// });

Route::get('products', 'ProductsController@index');
Route::get('products/{product}', 'ProductsController@show');

Route::middleware('auth:api')->get('/user', function (Request $request) {
  return $request->user();
});

Route::group(['middleware' => ['jwt.auth', 'api-header']], function() {
  Route::post('products', 'ProductsController@store');
  Route::put('products/{id}', 'ProductsController@update');
  Route::delete('products/{product}', 'ProductsController@delete');

  Route::get('user/home', function() {
      $user = Auth::user();
      $response = ['success' => true, 'data' => $user];
      return response()->json($response, 201);
  });
});

Route::group(['middleware' => 'api-header'], function() {
  Route::post('user/login', 'UserController@login');
  Route::post('user/register', 'UserController@register');
});

Route::group([
  'namespace' => 'Auth',    
  'middleware' => 'api',
  'prefix' => 'password'
], function () {    
  Route::post('create', 'PasswordResetController@create');
  Route::get('find/{token}', 'PasswordResetController@find');
  Route::post('reset', 'PasswordResetController@reset');
});