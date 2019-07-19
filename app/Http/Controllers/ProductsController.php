<?php

namespace App\Http\Controllers;

use App\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;

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
        $this->validate($request, [
            'title'         => 'required|unique:products|max:255',
            'description'   => 'required',
            'price'         => 'integer',
            'availability'  => 'boolean'
        ]);
        
        $request->image->store('public/images');
        $path = 'storage/images/' .$request->image->hashName();

        $product = Product::create($request->all() + ['posted_by' => Auth::user()->name]);
        $product->image = $path;
        $product->save();

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

        // str_replace on WINDOWS ONLY (Change for other OS)
        $productImg = str_replace('\\', '/', public_path($product->image));

        if($request->hasFile('image')) {
            if (File::exists($productImg)) {
                unlink($productImg);
            }

            $request->image->store('public/images');
            $path = 'storage/images/' . $request->image->hashName();
        }

        $data = $request->all();
        $data['image'] = $path;
        
        $product->update($data);

        return response()->json($productImg, 200);
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
