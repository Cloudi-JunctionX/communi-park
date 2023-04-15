<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <style>
        li {
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <ul>
        @foreach($locations as $location)
            <li>
                {{ $location->id }} - {{ $location->name }} -
                <a href="{{ route('locations.edit', $location->id) }}" target="_blank">Edit</a>
            </li>
        @endforeach
    </ul>
</body>
</html>
