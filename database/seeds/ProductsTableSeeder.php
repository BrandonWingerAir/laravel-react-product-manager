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

        $addVariety = true;

        for ($i = 0; $i < 14; $i++) {
            $min = 3;
            $max = 5;

            $user_interface = $faker->numberBetween($min, $max);
            $speed_size = $faker->numberBetween($min, $max);
            $software = $faker->numberBetween($min, $max);
            $support = $faker->numberBetween($min, $max);
            $administration = $faker->numberBetween($min, $max);

            $availability = $faker->numberBetween($min = 0, $max = 1);

            $rating = ($user_interface + $speed_size + $software + $support + $administration) / 5;

            if ($addVariety) {
                if ($availability === 0) {
                    $availability += 1;
                }

                $addVariety = false;
            } else {
                $addVariety = true;
            }

            $device_version = $faker->unique()->numberBetween($min = 1, $max = 20) . '.'
                . $faker->unique()->randomFloat($nbMaxDecimals = 4, $min = 0.01, $max = 99);

            Product::create([
                'title' => $faker->unique()->devicePlatform,
                'description' => $device_version,
                'user_interface' => $user_interface,
                'speed_size' => $speed_size,
                'software' => $software,
                'support' => $support,
                'administration' => $administration,
                'rating' => $rating,
                'availability' => $availability,
                'posted_by' => $faker->unique()->scientist
            ]);
        }
    }
}
