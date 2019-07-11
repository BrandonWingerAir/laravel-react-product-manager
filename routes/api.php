<?php

use Illuminate\Http\Request;

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
Route::post('products', 'ProductsController@store');
Route::put('products/{product}', 'ProductsController@update');
Route::delete('products/{product}', 'ProductsController@delete');

Route::middleware('auth:api')->get('/user', function (Request $request) {
  return $request->user();
});

Route::group(['middleware' => ['jwt.auth', 'api-header']], function() {
  // Protected Resources
  Route::get('users/list', function() {
      $users = App\User::all();
      $response = ['success' => true, 'data' => $users];
      return response()->json($response, 201);
  });
});

Route::group(['middleware' => 'api-header'], function() {
  Route::post('user/login', 'UserController@login');
  Route::post('user/register', 'UserController@register');
});