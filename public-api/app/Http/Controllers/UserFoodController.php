<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;
use Response;

class UserFoodController extends Controller
{
    private $privateApiUrl;
    private static $errStatusCode=500;
    private static $errMessage=['message' => "Sorry, some error occurred."];

    
    public function __construct()
    {
        $this->privateApiUrl = env('PRIVATE_API_URL');
    }

    public function foods(int $userId)
    {
        $response = Http::get("{$this->privateApiUrl}/users/{$userId}/foods");
        if($response->successful()){
            return $response->json();
        }
        else{
            return Response::json(static::$errMessage,static::$errStatusCode);
        }
    }

    public function food(int $userId, int $foodId)
    {
        $response = Http::get("{$this->privateApiUrl}/users/{$userId}/foods/{$foodId}");
        if($response->successful()){
            return $response->json();
        }
        else{
            return Response::json(static::$errMessage,static::$errStatusCode);
        }
    }

    public function deleteFood(int $userId, int $foodId)
    {
        $response = Http::delete("{$this->privateApiUrl}/users/{$userId}/foods/{$foodId}");
        if($response->successful()){
            return $response->json();
        }
        else{
            return Response::json(static::$errMessage,static::$errStatusCode);
        }
    }

    public function addFood(Request $request, int $userId, int $foodId)
    {
        $servingsPerWeek = $request->input('servingsPerWeek');
        
        $response = Http::put("{$this->privateApiUrl}/users/{$userId}/foods/{$foodId}", [
            'servingsPerWeek' => $servingsPerWeek
        ]);
        if($response->successful()){
            return $response->json();
        }
        else{
            return Response::json(static::$errMessage,static::$errStatusCode);
        }
    }
}
