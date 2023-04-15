<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Edit Location</title>
    <style>
        input {
            width: 100%;
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
 <form action="{{ route('locations.update', ['location' => $location->id]) }}" method="post">
     @csrf
     @method('PUT')
     <label for="name">Name</label>
     <input name="name" id="name" value="{{ $location->name }}" required>

     <label for="description">description</label>
     <input name="description" id="description" value="{{ $location->description }}">

     <label for="phone_number">phone</label>
     <input name="phone_number" id="phone_number" value="{{ $location->phone_number }}">

     <label for="fax">fax</label>
     <input name="fax" id="fax" value="{{ $location->fax }}">

     <label for="website">website</label>
     <input name="website" id="website" value="{{ $location->website }}">

     <label for="website_display">website_display</label>
     <input name="website_display" id="website_display" value="{{ $location->website_display }}">

     <label for="open_hour">Used slot</label>
     <input name="open_hour" id="open_hour" value="{{ $location->open_hour }}">

     <label for="close_hour">Total slot</label>
     <input name="close_hour" id="close_hour" value="{{ $location->close_hour }}">

     <label for="address1">address1</label>
     <input name="address1" id="address1" required value="{{ $location->address1 }}">

     <label for="address2">address2</label>
     <input name="address2" id="address2" value="{{ $location->address2 }}">

     <label for="country">country</label>
     <input name="country" id="country" required value="{{ $location->country }}">

     <label for="state">state</label>
     <input name="state" id="state" value="{{ $location->state }}">

     <label for="city">city</label>
     <input name="city" id="city" required value="{{ $location->city }}">

     <label for="zipcode">zipcode</label>
     <input name="zipcode" id="zipcode" value="{{ $location->zipcode }}">

     <label for="latitude">latitude</label>
     <input name="latitude" id="latitude" required value="{{ $location->latitude }}">

     <label for="longitude">longitude</label>
     <input name="longitude" id="longitude" required value="{{ $location->longitude }}">

     <label for="medias">medias</label>
     <input name="medias" id="medias" required value="{{ isset($location->medias[0]) ? $location->medias[0]['url'] : '' }}">

     <label for="email">email</label>
     <input name="email" id="email" value="{{ $location->email }}">

     <label for="marker">marker</label>
     <input name="marker" id="marker" value="{{ $location->marker }}">


     <button type="submit">Submit</button>
 </form>
</body>
</html>
