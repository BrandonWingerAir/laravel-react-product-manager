<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProductsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->increments('id');
            $table->string('posted_by');
            $table->timestamps();
            $table->string('title');
            $table->longText('image');
            $table->text('description');
            $table->longText('notes');
            $table->integer('user_interface');
            $table->integer('speed_size');
            $table->integer('software');
            $table->integer('support');
            $table->integer('administration');
            $table->float('rating');
            $table->tinyInteger('availability');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('products');
    }
}
