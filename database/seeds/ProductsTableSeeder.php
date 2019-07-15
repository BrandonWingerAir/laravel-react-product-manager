<?php

use App\Product;
use Illuminate\Database\Seeder;

class ProductsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = \Faker\Factory::create();
        \Bezhanov\Faker\ProviderCollectionHelper::addAllProvidersTo($faker);

        for ($i = 0; $i < 15; $i++) {
            Product::create([
                'title' => $faker->unique()->devicePlatform,
                'description' => $faker->unique()->ean8,
                'price' => $faker->randomNumber(3, true),
                'availability' => $faker->boolean(50),
                'posted_by' => 'Admin'
            ]);
        }
    }
}
