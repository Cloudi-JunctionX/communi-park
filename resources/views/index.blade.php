<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Laravel</title>
    <link rel="stylesheet" href="{{ asset('locator/css/dc.sl.min.css') }}">
</head>
<body>
<div class="dc-sl-container page-width">
    <header class="dc-sl-header">
        <div class="dc-sl-title h0" id="dc-sl-title">
            Parking Locator
        </div>
    </header>
    <div class="dc-sl-filter-container">
        <div class="dc-sl-tags">
            <button class="dc-sl-tag">Sky view</button>
            <button class="dc-sl-tag">Free wifi</button>
            <button class="dc-sl-tag">Beach view</button>
        </div>
        <div class="dc-sl-search-bar">
            <input type="text" name="dc-sl-search-input" class="dc-sl-search-input"
                   id="dc-sl-search-input"
                   placeholder="Type a postal code or address...">
            <button class="dc-sl-search-button" id="dc-sl-search-button" aria-label="Search">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
                    <path
                        d="M 21 3 C 11.601563 3 4 10.601563 4 20 C 4 29.398438 11.601563 37 21 37 C 24.355469 37 27.460938 36.015625 30.09375 34.34375 L 42.375 46.625 L 46.625 42.375 L 34.5 30.28125 C 36.679688 27.421875 38 23.878906 38 20 C 38 10.601563 30.398438 3 21 3 Z M 21 7 C 28.199219 7 34 12.800781 34 20 C 34 27.199219 28.199219 33 21 33 C 13.800781 33 8 27.199219 8 20 C 8 12.800781 13.800781 7 21 7 Z"/>
                </svg>
            </button>
        </div>
    </div>
    <div class="dc-sl-location-result">
        <div class="dc-sl-location-result-count-text">
            There are
            <span class="dc-sl-location-result-count" id="dc-sl-location-result-count">0</span>
            results displayed
        </div>
        <button class="dc-sl-location-toggle-list-map" id="dc-sl-location-toggle-list-map">
            <span>Show list</span>
            <svg id="dc-sl-location-show-map-icon" viewBox="0 0 32 32"
                 xmlns="http://www.w3.org/2000/svg"
                 aria-hidden="true" focusable="false">
                <path
                    d="M31.245 3.747a2.285 2.285 0 0 0-1.01-1.44A2.286 2.286 0 0 0 28.501 2l-7.515 1.67-10-2L2.5 3.557A2.286 2.286 0 0 0 .7 5.802v21.95a2.284 2.284 0 0 0 1.065 1.941A2.29 2.29 0 0 0 3.498 30l7.515-1.67 10 2 8.484-1.886a2.285 2.285 0 0 0 1.802-2.245V4.247a2.3 2.3 0 0 0-.055-.5zM12.5 25.975l-1.514-.303L9.508 26H9.5V4.665l1.514-.336 1.486.297v21.349zm10 1.36l-1.515.337-1.485-.297V6.025l1.514.304L22.493 6h.007v21.335z"></path>
            </svg>
            <svg id="dc-sl-location-show-list-icon" viewBox="0 0 16 16"
                 xmlns="http://www.w3.org/2000/svg"
                 aria-hidden="true" focusable="false">
                <path fill-rule="evenodd"
                      d="M2.5 11.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zM15 12v2H6v-2h9zM2.5 6.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zM15 7v2H6V7h9zM2.5 1.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zM15 2v2H6V2h9z"></path>
            </svg>
        </button>
    </div>
    <div class="dc-sl-mobile-tabs">
        <div class="dc-sl-list-tab" id="dc-sl-list-tab">List</div>
        <div class="dc-sl-map-tab dc-sl-tab-selected" id="dc-sl-map-tab">Map</div>
    </div>
    <div class="dc-sl-main-content">
        <div class="dc-sl-location-container" id="dc-sl-location-container">
            <div class="dc-sl-location-list-location-container">
                <div class="dc-sl-search-on-drag-loading-icon"></div>
            </div>
            <div class="dc-sl-locations" id="dc-sl-locations"></div>
        </div>
        <div class="dc-sl-map-container" id="dc-sl-map-container"></div>
    </div>
</div>
<script>
    function dcStoreLocatorGoogleMapCallback() {
        dcStoreLocator.initMap()
    }
</script>
<script src="{{ asset('locator/js/dc.sl.js') }}"></script>
<script src="https://cdn.shopify.com/s/files/1/0605/9632/2525/t/11/assets/dc-store-locator.js?v=1650452181"></script>
</body>
</html>
