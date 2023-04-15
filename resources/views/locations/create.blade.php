<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Create Location</title>
    <style>
        input {
            width: 100%;
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
 <form action="{{ route('locations.store') }}" method="post">
     @csrf
     <label for="name">Name</label>
     <input name="name" id="name" required>

     <label for="description">description</label>
     <input name="description" id="description">

     <label for="phone_number">phone</label>
     <input name="phone_number" id="phone_number">

     <label for="fax">fax</label>
     <input name="fax" id="fax">

     <label for="website">website</label>
     <input name="website" id="website">

     <label for="website_display">website_display</label>
     <input name="website_display" id="website_display">

     <label for="open_hour">Used slot</label>
     <input name="open_hour" id="open_hour">

     <label for="close_hour">Total slot</label>
     <input name="close_hour" id="close_hour">

     <label for="address1">address1</label>
     <input name="address1" id="address1" required>

     <label for="address2">address2</label>
     <input name="address2" id="address2">

     <label for="country">country</label>
     <input name="country" id="country" required>

     <label for="state">state</label>
     <input name="state" id="state">

     <label for="city">city</label>
     <input name="city" id="city" required>

     <label for="zipcode">zipcode</label>
     <input name="zipcode" id="zipcode">

     <label for="latitude">latitude</label>
     <input name="latitude" id="latitude" required>

     <label for="longitude">longitude</label>
     <input name="longitude" id="longitude" required>

     <label for="medias">medias</label>
     <input name="medias" id="medias" required>

     <label for="email">email</label>
     <input name="email" id="email">

     <label for="marker">marker</label>
     <input name="marker" id="marker">


     <button type="submit">Submit</button>
 </form>
</body>
</html>
