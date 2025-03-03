<?php

namespace App\Http\Controllers;

use App\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ProductsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Product::all();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title'         => 'required|max:20',
            'description'   => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors(), 'error' => 'Form data invalid!'], 422);
        }

        if ($request->hasFile('image')) {
            $request->image->store('public/images');
            $path = 'storage/images/' .$request->image->hashName();

            $product = Product::create($request->all() + ['posted_by' => Auth::user()->name]);
            $product->image = $path;
            $product->save();
        } else {
            $product = Product::create($request->all() + ['posted_by' => Auth::user()->name]);
        }

        return response()->json($product, 201);
        
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Product  $product
     * @return \Illuminate\Http\Response
     */
    public function show(Product $product)
    {
        return $product;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        if($request->hasFile('image')) {
            $productImg = public_path($product->image);

            if (is_file($productImg)) {
                unlink($productImg);
            }

            $request->image->store('public/images');

            $path = 'storage/images/' . $request->image->hashName();
            $data = $request->all();
            $data['image'] = $path;
        } else {
            $data = $request->all();
        }

        $product->update($data);

        return response()->json($product, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Product  $product
     * @return \Illuminate\Http\Response
     */
    public function delete(Product $product)
    {
        $product->delete();
        return response()->json(null, 204);
    }
}
