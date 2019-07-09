### Laravel Back-End
Run `composer install`. Setup your Database, .env file, take care of migration `php artisan migrate` and seeding `php artisan db:seed --class=ProductsTableSeeder`. Once you are done with that, run `php artisan serve`. The api is accessible at `http://localhost:8000/api/products`.

### React Front-End
Run `npm install && npm run dev`. Alternatively you can use yarn over npm too. Now, head over to `http://localhost:8000/`.