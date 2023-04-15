/* eslint-disable no-undef */

// noinspection JSUnusedGlobalSymbols

class DcStoreLocator {
    constructor() {
        this.map = null
        this.infoWindow = null
        this.searchBox = null
        this.mapContainer = null
        this.locationContainer = null
        this.markers = []
        this.mapCluster = null
        this.zoomingInToMarker = false
        this.locationListContainer = null
        this.detailLocationModal = null
        this.socket = null
        this.settings = {
            app: {
                api_key: 'AIzaSyA-zwAOJrXDqDN1sVy_9ieWTHYAkvkzNGA',
                location_url: '/locator/js/locations.js',
            },
            customize: {
                "text": {"show_map_text_button": "Show Map", "show_list_text_button": "Show List"},
                "function": {
                    "map_center_coordinates": {"lat": 21.021424559392315, "lng": 105.79727663760241},
                    "zoom": 15,
                    "max_first_load": 1100000,
                    "enable_clustering": false
                },
                "list_and_map": {
                    "list_display_fields": ["id", "shop_id", "name", "priority", "description", "phone_number", "fax", "website", "website_display", "open_hour", "close_hour", "address1", "address2", "country", "state", "city", "zipcode", "latitude", "longitude", "medias", "status", "schedule", "email", "created_at", "updated_at"],
                    "map_display_fields": ["id", "shop_id", "name", "priority", "description", "phone_number", "fax", "website", "website_display", "open_hour", "close_hour", "address1", "address2", "country", "state", "city", "zipcode", "latitude", "longitude", "medias", "status", "schedule", "email", "created_at", "updated_at"],
                    "list_location_fields_sort": ["id", "shop_id", "name", "priority", "description", "phone_number", "fax", "website", "website_display", "open_hour", "close_hour", "address1", "address2", "country", "state", "city", "zipcode", "latitude", "longitude", "medias", "status", "email", "created_at", "updated_at", "schedule"],
                    "map_location_fields_sort": ["id", "shop_id", "name", "priority", "description", "phone_number", "fax", "website", "website_display", "open_hour", "close_hour", "address1", "address2", "country", "state", "city", "zipcode", "latitude", "longitude", "medias", "status", "email", "created_at", "updated_at", "schedule"]
                }
            }
        }
    }

    initApp() {
        this.addMapPlugin()
        this.appendGoogleMapApi()
    }

    processApp() {
        this.initialVariables()
        this.prepareMap()
        this.loadLocation()
        this.addEventListener()
    }

    prepareMap() {
        this.initSearchBox()
        this.createCollapseControl()
        this.createSearchOnDragControl()
    }

    addEventListener() {
        this.addSearchBoxListener()
        this.addToggleMapAndListListener()
        this.addSwitchMapAndListListener()
        this.addOnDragEndListener()
        this.addOnZoomListener()
        this.addOnMapTilesListener()
    }

    initialVariables() {
        this.infoWindow = new google.maps.InfoWindow()
        this.locationContainer = document.getElementById(
            'dc-sl-location-container'
        )
        this.locationListContainer = document.getElementById('dc-sl-locations')
        this.mapContainer = document.getElementById('dc-sl-map-container')
        if (dcStoreLocator.settings.customize.function.enable_clustering) {
            const intervalCheckMarkerCluster = setInterval(() => {
                if (typeof markerClusterer !== 'undefined') {
                    if (!dcStoreLocator.mapCluster) {
                        dcStoreLocator.mapCluster =
                            new markerClusterer.MarkerClusterer({
                                map: dcStoreLocator.map,
                                markers: [],
                            })
                        clearInterval(intervalCheckMarkerCluster)
                    }
                }
            }, 200)
            setTimeout(() => clearInterval(intervalCheckMarkerCluster), 10e3)
        }
    }

    /**
     * Prepare map
     */

    addMapPlugin() {
        const script = document.createElement('script')
        script.setAttribute(
            'src',
            `https://unpkg.com/@googlemaps/markerclusterer/dist/index.min.js`
        )
        document.querySelector('body').appendChild(script)
        const detailModal = document.getElementById('booking-modal')
        this.detailLocationModal = new bootstrap.Modal(detailModal)
    }

    appendGoogleMapApi() {
        const apiKey = dcStoreLocator.settings.app.api_key
        const script = document.createElement('script')
        script.setAttribute(
            'src',
            `//maps.google.com/maps/api/js?key=${apiKey}&libraries=places&callback=dcStoreLocatorGoogleMapCallback`
        )
        document.querySelector('body').appendChild(script)
    }

    initMap() {
        dcStoreLocator.map = new google.maps.Map(
            document.getElementById('dc-sl-map-container'),
            {
                center: {
                    lat: dcStoreLocator.settings.customize.function
                        .map_center_coordinates.lat,
                    lng: dcStoreLocator.settings.customize.function
                        .map_center_coordinates.lng,
                },
                zoom: dcStoreLocator.settings.customize.function.zoom,
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: false,
                clickableIcons: false,
                styles: [
                    {
                        "featureType": "poi",
                        "stylers": [
                            {
                                "visibility": "off"
                            }
                        ]
                    },
                    {
                        "featureType": "landscape",
                        "stylers": [
                            {
                                "visibility": "off"
                            }
                        ]
                    }
                ]
            }
        )
        this.processApp()
    }

    loadLocation() {
        const script = document.createElement('script')
        script.src = dcStoreLocator.settings.app.location_url
        document.querySelector('body').appendChild(script)
    }

    loadLocationCallback(results) {
        const features = results.features.slice(
            0,
            dcStoreLocator.settings.customize.function.max_first_load
        )
        dcStoreLocator.createMarkers(features)
    }

    createMarkers(features) {
        for (let i = 0; i < features.length; i++) {
            const feature = features[i]
            const coords = feature.geometry.coordinates
            const latLng = new google.maps.LatLng(coords[1], coords[0])
            const icon = feature.properties.marker && {
                url: feature.properties.marker || null,
                size: new google.maps.Size(50, 50),
                scaledSize: new google.maps.Size(50, 50),
            }
            const marker = new google.maps.Marker({
                map: null,
                position: latLng,
                title: feature.properties.name,
                icon,
                optimized: true,
                visible: false,
            })
            dcStoreLocator.addMarkerClickListener(marker, feature)
            dcStoreLocator.markers.push({
                id: feature.properties.id,
                marker,
                properties: feature,
            })
        }
    }

    updateCluster() {
        if (dcStoreLocator.mapCluster) {
            dcStoreLocator.mapCluster.addMarkers(
                dcStoreLocator
                    .getVisibleMarker()
                    .map((markerObj) => markerObj.marker)
            )
        }
    }

    updateVisibleMarkers() {
        dcStoreLocator.mapCluster && dcStoreLocator.mapCluster.clearMarkers()
        dcStoreLocator.markers.forEach((markerObject) => {
            if (dcStoreLocator.isInBound(markerObject.marker)) {
                markerObject.marker.setMap(dcStoreLocator.map)
                markerObject.marker.setVisible(true)
            } else {
                markerObject.marker.setMap(null)
                markerObject.marker.setVisible(false)
            }
        })
        dcStoreLocator.updateCluster()
        dcStoreLocator.infoWindow.close()
    }

    initSearchBox() {
        const input = document.getElementById('dc-sl-search-input')
        this.searchBox = new google.maps.places.SearchBox(input)
    }

    createCollapseControl() {
        const controller = dcStoreLocator.renderElm(
            'div',
            'dc-sl-control-collapse'
        )
        const button = dcStoreLocator.renderElm(
            'button',
            'dc-sl-control-collapse-button'
        )
        const showFullMap = dcStoreLocator.renderElm(
            'div',
            'dc-sl-control-collapse-full'
        )
        const showHalfMap = dcStoreLocator.renderElm(
            'div',
            'dc-sl-control-collapse-half'
        )
        showFullMap.innerHTML = `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><g fill="none"><path d="m20 28-11.29289322-11.2928932c-.39052429-.3905243-.39052429-1.0236893 0-1.4142136l11.29289322-11.2928932"></path></g></svg>`
        showHalfMap.innerHTML = `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><g fill="none"><path d="m20 28-11.29289322-11.2928932c-.39052429-.3905243-.39052429-1.0236893 0-1.4142136l11.29289322-11.2928932"></path></g></svg> <span>Show location list</span>`
        button.append(showFullMap, showHalfMap)
        controller.append(button)
        button.addEventListener('click', dcStoreLocator.collapseListener)
        dcStoreLocator.map.controls[google.maps.ControlPosition.LEFT_TOP].push(
            controller
        )
    }

    createSearchOnDragControl() {
        const searchOnDragContainer = dcStoreLocator.renderElm(
            'div',
            'dc-sl-search-on-drag-container'
        )
        const loadingContainer = dcStoreLocator.renderElm(
            'div',
            'dc-sl-search-on-drag-loading-container'
        )
        const loadingIcon = dcStoreLocator.renderElm(
            'div',
            'dc-sl-search-on-drag-loading-icon'
        )
        loadingContainer.append(loadingIcon)
        searchOnDragContainer.append(loadingContainer)
        dcStoreLocator.map.controls[
            google.maps.ControlPosition.TOP_CENTER
            ].push(searchOnDragContainer)
    }

    /**
     * Event listener
     */
    addSearchBoxListener() {
        dcStoreLocator.map.addListener('bounds_changed', () => {
            dcStoreLocator.searchBox.setBounds(dcStoreLocator.map.getBounds())
        })
        dcStoreLocator.searchBox.addListener('places_changed', () => {
            const places = dcStoreLocator.searchBox.getPlaces()
            if (places.length === 0) return
            const bounds = new google.maps.LatLngBounds()
            places.forEach((place) => {
                if (!place.geometry || !place.geometry.location) {
                    console.log('Returned place contains no geometry')
                    return
                }
                if (place.geometry.viewport) {
                    bounds.union(place.geometry.viewport)
                } else {
                    bounds.extend(place.geometry.location)
                }
            })
            dcStoreLocator.map.fitBounds(bounds)
        })
    }

    collapseListener() {
        const full = this.firstChild
        const half = this.lastChild
        if (getComputedStyle(full).display !== 'none') {
            full.style.display = 'none'
            half.style.display = 'flex'
            dcStoreLocator.mapContainer.style.width = '100%'
            dcStoreLocator.locationContainer.style.width = '0'
        } else {
            full.style.display = 'flex'
            half.style.display = 'none'
            dcStoreLocator.mapContainer.style.width = '50%'
            dcStoreLocator.locationContainer.style.width = '50%'
        }
    }

    addToggleMapAndListListener() {
        const toggleButton = document.getElementById(
            'dc-sl-location-toggle-list-map'
        )
        if (toggleButton) {
            toggleButton.addEventListener('click', () => {
                const locationContainer = document.querySelector(
                    `#dc-sl-location-container`
                )
                const mapContainer =
                    document.querySelector(`#dc-sl-map-container`)
                const text = document.querySelector(
                    `#dc-sl-location-toggle-list-map > span`
                )
                const mapIcon = document.querySelector(
                    `svg#dc-sl-location-show-map-icon`
                )
                const listIcon = document.querySelector(
                    `svg#dc-sl-location-show-list-icon`
                )
                if (locationContainer.offsetHeight > 0) {
                    locationContainer.style.height = 0
                    mapContainer.style.height = '100%'
                    text.textContent =
                        dcStoreLocator.settings.customize.text.show_list_text_button
                    mapIcon.style.display = 'none'
                    listIcon.style.display = 'block'
                } else {
                    mapContainer.style.height = 0
                    locationContainer.style.height = '100%'
                    text.textContent =
                        dcStoreLocator.settings.customize.text.show_map_text_button
                    listIcon.style.display = 'none'
                    mapIcon.style.display = 'block'
                }
            })
        }
    }

    addSwitchMapAndListListener() {
        const mainContainer = document.querySelector(`.dc-sl-main-content`)
        const showMapTab = document.getElementById(`dc-sl-map-tab`)
        const showListTab = document.getElementById(`dc-sl-list-tab`)
        if (showListTab && showListTab) {
            showMapTab.addEventListener('click', () => {
                showMapTab.classList.add('dc-sl-tab-selected')
                showListTab.classList.remove('dc-sl-tab-selected')
                dcStoreLocator.mapContainer.style.height = '100%'
                dcStoreLocator.locationContainer.style.height = 0
                mainContainer.style.flexDirection = 'column-reverse'
            })
            showListTab.addEventListener('click', () => {
                showListTab.classList.add('dc-sl-tab-selected')
                showMapTab.classList.remove('dc-sl-tab-selected')
                dcStoreLocator.locationContainer.style.height = '100%'
                dcStoreLocator.mapContainer.style.height = 0
                mainContainer.style.flexDirection = 'column'
            })
        }
    }

    addOnDragEndListener() {
        google.maps.event.addListener(
            dcStoreLocator.map,
            'dragend',
            function () {
                dcStoreLocator.map &&
                dcStoreLocator.updateLocationAndMarkerState()
            }
        )
    }

    addOnMapTilesListener() {
        google.maps.event.addListenerOnce(
            dcStoreLocator.map,
            'tilesloaded',
            function () {
                if (dcStoreLocator.map) {
                    dcStoreLocator.updateVisibleMarkers()
                    google.maps.event.trigger(dcStoreLocator.map, 'dragend')
                }
            }
        )
    }

    addLocationListClickListener(element, locationId) {
        element.addEventListener('click', function () {
            const location = dcStoreLocator.getLocationMarkerById(locationId)
            if (location) {
                dcStoreLocator.zoomingInToMarker = true;
                dcStoreLocator.clearSelectedLocation()
                this.classList.add('dc-sl-location-selected')

                dcStoreLocator.map.setCenter({
                    lat: parseFloat(location.properties.properties.latitude),
                    lng: parseFloat(location.properties.properties.longitude)
                })
                dcStoreLocator.map.setZoom(16)
                google.maps.event.trigger(location.marker, 'click')

                dcStoreLocator.delay(() => {
                    dcStoreLocator.zoomingInToMarker = false;
                }, 1e3)
            }
        })
    }

    addMarkerClickListener(marker, feature) {
        marker.addListener('click', () => {
            dcStoreLocator.infoWindow.setContent(
                dcStoreLocator.renderLocationPopup(feature)
            )
            dcStoreLocator.clearSelectedLocation()
            dcStoreLocator.setSelectedLocationInList(feature.properties.id)
            if (!marker.getMap()) {
                dcStoreLocator.zoomingInToMarker = true
                dcStoreLocator.map.setZoom(14)
                dcStoreLocator.map.setCenter(marker.getPosition())
            }
            dcStoreLocator.infoWindow.open({
                anchor: marker,
                map: dcStoreLocator.map,
                shouldFocus: true,
            })
        })
    }

    addOnZoomListener() {
        dcStoreLocator.map.addListener(
            'zoom_changed',
            dcStoreLocator.delay(() => {
                if (!dcStoreLocator.zoomingInToMarker) {
                    dcStoreLocator.updateLocationAndMarkerState()
                }
            }, 400)
        )
    }

    /**
     * Helpers
     */
    renderElm(elmName = 'div', classes, attributes = {}) {
        const element = document.createElement(elmName)
        if (classes) {
            if (Array.isArray(classes)) {
                classes.map((x) => element.classList.add(x))
            } else {
                if (classes && classes.length !== 0)
                    element.classList.add(classes)
            }
        }
        Object.keys(attributes).forEach((key) =>
            element.setAttribute(key, attributes[key])
        )
        return element
    }

    isEnableLocationField(feature) {
        try {
            return (
                dcStoreLocator.settings.customize.list_and_map.list_display_fields.indexOf(
                    feature
                ) !== -1
            )
        } catch (e) {
            console.error(e)
            return false
        }
    }

    isInBound(marker) {
        return dcStoreLocator.map.getBounds().contains(marker.getPosition())
    }

    getVisibleMarker(onlyVisible = false) {
        if (onlyVisible) {
            return dcStoreLocator.markers.filter((markerObject) =>
                markerObject.marker.getVisible()
            )
        }
        return dcStoreLocator.markers.filter(
            (markerObject) =>
                markerObject.marker.getVisible() && markerObject.marker.getMap()
        )
    }

    getLocationMarkerById(id) {
        return dcStoreLocator.markers.find((markerObj) => markerObj.id === id)
    }

    delay(fn, delay) {
        let timer = null
        return function () {
            const context = this
            const args = arguments
            clearTimeout(timer)
            timer = setTimeout(function () {
                fn.apply(context, args)
            }, delay)
        }
    }

    getFirstImageInMedia(galleries) {
        if (!Array.isArray(galleries)) return null
        return galleries[0] || null
    }

    /**
     * Location builder
     */

    renderLocations() {
        const visibleMarkers = dcStoreLocator.getVisibleMarker(true)
        const locationCount = document.getElementById(
            `dc-sl-location-result-count`
        )
        if (locationCount) {
            locationCount.textContent = visibleMarkers.length + ''
        }
        for (let i = 0; i < visibleMarkers.length; i++) {
            const location = visibleMarkers[i].properties.properties
            const locationContainer = dcStoreLocator.renderLocationContainer(
                location.id
            )
            dcStoreLocator.addLocationListClickListener(
                locationContainer,
                location.id
            )
            const locationInfoContainer =
                dcStoreLocator.renderSortedFieldLocation(location, 'list')
            const locationImageContainer =
                dcStoreLocator.renderLocationImageContainer(location.medias)
            locationContainer.append(
                locationImageContainer,
                locationInfoContainer
            )
            dcStoreLocator.locationListContainer.append(locationContainer)
        }
    }

    renderLocationPopup(locationInfo) {
        const locationPopup = this.renderLocationPopupContainer(
            locationInfo.properties.id
        )
        const locationImageContainer = this.renderLocationPopupImageContainer(
            dcStoreLocator.getFirstImageInMedia(locationInfo.properties.medias)
        )
        const locationInfoContainer = this.renderSortedFieldLocation(
            locationInfo.properties,
            'map'
        )
        if (locationImageContainer) {
            locationPopup.append(locationImageContainer)
        }
        locationPopup.append(locationInfoContainer)
        const bookingNowButton = this.renderBookNowButton(locationInfo)
        const direction = this.renderDirection(locationInfo)
        locationInfoContainer.append(direction)
        if (bookingNowButton) {
            locationInfoContainer.prepend(bookingNowButton)
        }
        return locationPopup.outerHTML
    }

    renderBookNowButton(location) {
        if (!location.properties.close_hour || !location.properties.open_hour) return null
        const totalSlot = parseInt(location.properties.close_hour)
        const usedSlot = parseInt(location.properties.open_hour)
        const remaining = totalSlot - usedSlot
        const bookButton = this.renderElm('button', 'dc-sl-booking-button', {
            role: 'button',
            'onClick': `dcStoreLocator.onBookingClicked(${location.properties.id})`
        })
        bookButton.textContent = 'BOOKING NOW !'
        bookButton.disabled = !remaining
        return bookButton
    }

    renderDirection(location) {
        const link = this.renderElm('a', 'dc-sl-direction', {
            href: `https://google.com/maps/dir/${location.properties.latitude},${location.properties.longitude}`,
            target: '_blank'
        })
        link.textContent = 'Direction to here ↑'
        return link
    }

    onBookingClicked(id) {
        const location = dcStoreLocator.getLocationMarkerById(id)
        console.log(location)
        document.getElementById('booking-title').textContent = location.properties.properties.name
        const locationInfoContainer = this.renderSortedFieldLocation(
            location.properties.properties,
            'map'
        )
        document.querySelector('#booking-modal .modal-body').innerHTML = locationInfoContainer.outerHTML
        this.detailLocationModal.show()

        if (!this.socket) {
            this.socket = io('http://localhost:3006', {
                query: {
                    locationId: id
                }
            });

        }
    }

    renderSortedFieldLocation(location, type = 'list') {
        let locationInfoContainer, sortFieldList
        if (type === 'map') {
            locationInfoContainer = this.renderLocationPopupInfoContainer()
            sortFieldList =
                dcStoreLocator.settings.customize.list_and_map
                    .map_location_fields_sort
        } else {
            locationInfoContainer = this.renderLocationInfoContainer()
            sortFieldList =
                dcStoreLocator.settings.customize.list_and_map
                    .list_location_fields_sort
        }
        const fieldsInfoMap = {
            name: function () {
                return dcStoreLocator.isEnableLocationField('name')
                    ? dcStoreLocator.renderLocationName(location.name)
                    : null
            },
            address1: function () {
                let content = null
                if (dcStoreLocator.isEnableLocationField('address1')) {
                    content = dcStoreLocator.renderLocationAddress(
                        1,
                        location.address1
                    )
                }
                return content
            },
            address2: function () {
                let content = null
                if (dcStoreLocator.isEnableLocationField('address2')) {
                    content = dcStoreLocator.renderLocationAddress(
                        2,
                        location.address2
                    )
                }
                return content
            },
            // TODO
            tags: function () {
                return dcStoreLocator.isEnableLocationField('tags')
                    ? dcStoreLocator.renderLocationTags(location.tags)
                    : null
            },
            // TODO
            custom_fields: function () {
                let content = null
                const isEnable =
                    dcStoreLocator.isEnableLocationField('custom_fields')
                if (isEnable) {
                    content = dcStoreLocator.renderLocationCustomField(
                        location.custom_fields
                    )
                }
                return content
            },
            fax: function () {
                let content = null
                if (dcStoreLocator.isEnableLocationField('fax')) {
                    content = dcStoreLocator.renderLocationFax(location.fax)
                }
                return content
            },
            phone_number: function () {
                let content = null
                if (dcStoreLocator.isEnableLocationField('phone_number')) {
                    content = dcStoreLocator.renderLocationPhone(
                        location.phone_number
                    )
                }
                return content
            },
            email: function () {
                return dcStoreLocator.isEnableLocationField('email')
                    ? dcStoreLocator.renderLocationEmail(location.email)
                    : null
            },
            website: function () {
                let content = null
                if (dcStoreLocator.isEnableLocationField('website')) {
                    content = dcStoreLocator.renderLocationWebsite(
                        location.website,
                        location.website_display
                    )
                }
                return content
            },
            description: () => {
                let content = null
                if (dcStoreLocator.isEnableLocationField('description')) {
                    content = dcStoreLocator.renderLocationDescription(
                        location.description
                    )
                }
                return content
            },
            schedule: () => {
                let content = null
                if (dcStoreLocator.isEnableLocationField('schedule')) {
                    content = dcStoreLocator.renderLocationSchedule(
                        location.open_hour,
                        location.close_hour
                    )
                }
                return content
            },
        }
        sortFieldList.forEach((field) => {
            if (fieldsInfoMap[field]) {
                const elements = fieldsInfoMap[field]()
                if (elements) {
                    if (Array.isArray(elements)) {
                        elements.forEach((elm) =>
                            locationInfoContainer.append(elm)
                        )
                    } else {
                        locationInfoContainer.append(elements)
                    }
                }
            }
        })
        return locationInfoContainer
    }

    renderLocationContainer(locationId) {
        return dcStoreLocator.renderElm('div', 'dc-sl-location', {
            'data-location-id': locationId,
        })
    }

    renderLocationImageContainer(images) {
        const hasAction = Array.isArray(images) && images.length > 0
        const imageContainer = this.renderElm('div', 'dc-sl-location-images', {
            'data-location-with-slide': hasAction ? 'true' : 'false',
        })
        const renderImage = (imageLink) => {
            const container = dcStoreLocator.renderElm(
                'div',
                'dc-sl-location-image'
            )
            const image = dcStoreLocator.renderElm('img', null, {
                src: imageLink,
                alt: 'image',
            })
            container.append(image)
            return container
        }
        let imagesDOM = []
        if (Array.isArray(images) && images.length > 0) {
            imagesDOM = images.map((image) => renderImage(image.url))
        } else {
            const container = dcStoreLocator.renderElm(
                'div',
                'dc-sl-location-image'
            )
            container.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 511 511" xml:space="preserve"><g><path d="M503.5,440H479V207.433c13.842-3.487,24-16.502,24-31.933v-104c0-8.547-6.953-15.5-15.5-15.5h-464C14.953,56,8,62.953,8,71.5v104c0,15.432,10.158,28.446,24,31.933V440H7.5c-4.142,0-7.5,3.358-7.5,7.5s3.358,7.5,7.5,7.5h496c4.142,0,7.5-3.358,7.5-7.5S507.642,440,503.5,440z M488,71.5v104c0,9.383-6.999,17.384-15.602,17.834c-4.595,0.235-8.939-1.36-12.254-4.505c-3.317-3.148-5.145-7.4-5.145-11.971V71h32.5C487.776,71,488,71.224,488,71.5z M71,71h33v105.858c0,9.098-7.402,16.5-16.5,16.5s-16.5-7.402-16.5-16.5V71z M119,71h33v105.858c0,9.098-7.402,16.5-16.5,16.5s-16.5-7.402-16.5-16.5V71z M167,71h33v105.858c0,9.098-7.402,16.5-16.5,16.5s-16.5-7.402-16.5-16.5V71z M215,71h33v105.858c0,9.098-7.402,16.5-16.5,16.5s-16.5-7.402-16.5-16.5V71z M263,71h33v105.858c0,9.098-7.402,16.5-16.5,16.5s-16.5-7.402-16.5-16.5V71z M311,71h33v105.858c0,9.098-7.402,16.5-16.5,16.5s-16.5-7.402-16.5-16.5V71z M359,71h33v105.858c0,9.098-7.402,16.5-16.5,16.5s-16.5-7.402-16.5-16.5V71z M407,71h33v105.858c0,9.098-7.402,16.5-16.5,16.5s-16.5-7.402-16.5-16.5V71z M23,175.5v-104c0-0.276,0.224-0.5,0.5-0.5H56v105.858c0,4.571-1.827,8.823-5.145,11.971c-3.314,3.146-7.663,4.743-12.254,4.505C29.999,192.884,23,184.883,23,175.5z M47,207.462c5.266-1.279,10.128-3.907,14.181-7.753c0.822-0.78,1.599-1.603,2.326-2.462c5.782,6.793,14.393,11.11,23.993,11.11c9.604,0,18.218-4.32,24-11.119c5.782,6.799,14.396,11.119,24,11.119s18.218-4.32,24-11.119c5.782,6.799,14.396,11.119,24,11.119s18.218-4.32,24-11.119c5.782,6.799,14.396,11.119,24,11.119s18.218-4.32,24-11.119c5.782,6.799,14.396,11.119,24,11.119s18.218-4.32,24-11.119c5.782,6.799,14.396,11.119,24,11.119s18.218-4.32,24-11.119c5.782,6.799,14.396,11.119,24,11.119s18.218-4.32,24-11.119c5.782,6.799,14.396,11.119,24,11.119c9.6,0,18.21-4.317,23.993-11.11c0.728,0.859,1.504,1.682,2.326,2.462c4.054,3.847,8.914,6.482,14.181,7.761V440h-33V263.5c0-8.547-6.953-15.5-15.5-15.5h-96c-8.547,0-15.5,6.953-15.5,15.5V440H47V207.462z M416,440h-97V263.5c0-0.276,0.224-0.5,0.5-0.5h96c0.276,0,0.5,0.224,0.5,0.5V440z"/> <path d="M343.5,336c-4.142,0-7.5,3.358-7.5,7.5v16c0,4.142,3.358,7.5,7.5,7.5s7.5-3.358,7.5-7.5v-16C351,339.358,347.642,336,343.5,336z"/> <path d="M262.5,248h-174c-4.687,0-8.5,3.813-8.5,8.5v142c0,4.687,3.813,8.5,8.5,8.5h174c4.687,0,8.5-3.813,8.5-8.5v-142C271,251.813,267.187,248,262.5,248z M256,392H95V263h161V392z"/></g></svg>`
            imagesDOM.push(container)
        }
        imagesDOM.forEach((el) => imageContainer.append(el))
        if (hasAction) {
            const nextAction = dcStoreLocator.renderElm(
                'a',
                'dc-sl-location-image-next'
            )
            const preAction = dcStoreLocator.renderElm(
                'a',
                'dc-sl-location-image-prev'
            )
            nextAction.innerHTML = `&#10094;`
            preAction.innerHTML = `&#10095;`
            imageContainer.append(preAction, nextAction)
        }
        return imageContainer
    }

    renderLocationInfoContainer() {
        return this.renderElm('div', 'dc-sl-location-info')
    }

    renderLocationName(locationName) {
        const elm = this.renderElm('div', 'dc-sl-location-name')
        elm.textContent = locationName
        return elm
    }

    renderLocationAddress(addressLine = 1, address = '', display = true) {
        const className =
            addressLine === 1
                ? ['dc-sl-location-address']
                : ['dc-sl-location-address2']
        if (!address || !display) {
            className.push('dc-sl-hidden')
        }
        const elm = this.renderElm('div', className)
        elm.textContent = address
        return elm
    }

    renderLocationTags(tags, display = true) {
        const className = ['dc-sl-location-tags']
        let text = ''
        if (!tags || !display) {
            className.push('dc-sl-hidden')
        }
        if (Array.isArray(tags) && tags.length > 0) {
            text = tags.join(', ')
        } else {
            className.push('dc-sl-hidden')
        }
        const elm = this.renderElm('div', className)
        elm.textContent = text
        return elm
    }

    renderLocationCustomField(fields, display = true) {
        const className = ['dc-sl-location-custom-field']
        let customFields = []
        if (!display) {
            className.push('dc-sl-hidden')
        }
        if (Array.isArray(fields) && fields.length > 0) {
            customFields = fields.map((field) => {
                const container = dcStoreLocator.renderElm('div', className)
                const label = dcStoreLocator.renderElm('span')
                label.textContent = `${field.label}:`
                container.textContent = field.value
                container.prepend(label)
                return container
            })
        }
        return customFields
    }

    renderLocationPhone(phone, display = true) {
        const className = ['dc-sl-location-phone']
        if (!phone || !display) {
            className.push('dc-sl-hidden')
        }
        const container = this.renderElm('div', className)
        const label = this.renderElm('span')
        const phoneTag = this.renderElm('a', null, {
            href: `tel:${phone}`,
        })
        label.textContent = `${
            dcStoreLocator.settings.customize.text.phone || 'Phone'
        }: `
        phoneTag.textContent = phone
        container.append(label, phoneTag)
        return container
    }

    renderLocationEmail(email, display = true) {
        const className = ['dc-sl-location-email']
        if (!email || !display) {
            className.push('dc-sl-hidden')
        }
        const container = this.renderElm('div', className)
        const label = this.renderElm('span')
        const emailTag = this.renderElm('a', null, {
            href: `mailto:${email}`,
        })
        label.textContent = `${
            dcStoreLocator.settings.customize.text.email || 'Email'
        }: `
        emailTag.textContent = email
        container.append(label, emailTag)
        return container
    }

    renderLocationWebsite(website, websiteDisplay, display = true) {
        const className = ['dc-sl-location-website']
        if (!website || !display) {
            className.push('dc-sl-hidden')
        }
        const container = this.renderElm('div', className)
        const label = this.renderElm('span')
        const websiteTag = this.renderElm('a', null, {
            href: website,
            target: '_blank',
        })
        label.textContent = `${
            dcStoreLocator.settings.customize.text.website || 'Website'
        }: `
        websiteTag.textContent = websiteDisplay || website
        container.append(label, websiteTag)
        return container
    }

    renderLocationDescription(note, display = true) {
        const className = ['dc-sl-location-note']
        if (!note || !display) {
            className.push('dc-sl-hidden')
        }
        const container = this.renderElm('div', className)
        container.textContent = note
        return container
    }

    renderLocationFax(fax, display = true) {
        const className = ['dc-sl-location-note']
        if (!fax || !display) {
            className.push('dc-sl-hidden')
        }
        const container = this.renderElm('div', className)
        const prevText = dcStoreLocator.settings.customize.text.fax || 'Fax'
        container.textContent = `${prevText}: ${fax}`
        return container
    }

    renderLocationDistance(
        distance,
        measurement = 'kilometers',
        display = true
    ) {
        const className = ['dc-sl-location-distance']
        if (distance === false || distance === null || !display) {
            className.push('dc-sl-hidden')
        }
        const elm = this.renderElm('div', className)
        elm.textContent = `${distance} ${measurement}`
        return elm
    }

    renderLocationSchedule(open, close, display = true) {
        const className = ['dc-sl-location-schedule']
        if (!open || !display) {
            className.push('dc-sl-hidden')
        }

        const usedSlot = parseInt(open)
        const totalSlot = parseInt(close)
        const remaining = totalSlot - usedSlot
        const container = this.renderElm('div', className)
        const prevText =
            dcStoreLocator.settings.customize.text.schedule || 'Slots'

        container.innerHTML = `${prevText}: ${open} / ${close}
                <span class="${remaining < 10 ? 'dc-sl-text-danger' : 'dc-sl-text-success'}">
                    (Remaining: ${remaining} slots)
                </span>`
        return container
    }

    renderLocationPopupContainer(locationId) {
        return this.renderElm('div', 'dc-sl-location-detail-map-container', {
            'data-location-id': locationId,
        })
    }

    renderLocationPopupImageContainer(image) {
        if (!image) return null
        const container = this.renderElm(
            'div',
            'dc-sl-location-detail-image-map-container'
        )
        container.style.backgroundImage = `url(${image.url})`
        return container
    }

    renderLocationPopupInfoContainer() {
        return this.renderElm('div', 'dc-sl-location-map-info-container')
    }

    /**
     * Process task
     */
    updateLocationAndMarkerState() {
        dcStoreLocator.locationListContainer.innerHTML = ''
        dcStoreLocator.visibleLoadingLocation()
        setTimeout(() => {
            dcStoreLocator.updateVisibleMarkers()
            dcStoreLocator.renderLocations()
            dcStoreLocator.visibleLoadingLocation(false)
            dcStoreLocator.zoomingInToMarker = false
        }, 1500)
    }

    /**
     * UI function
     */
    visibleLoadingLocation(visible = true) {
        const locationListContainer = document.querySelector(
            `.dc-sl-location-list-location-container .dc-sl-search-on-drag-loading-icon`
        )
        const loadingContainer = document.querySelector(
            `.dc-sl-map-container .dc-sl-search-on-drag-container`
        )
        if (loadingContainer) {
            loadingContainer.style.display = visible ? 'block' : 'none'
        }
        const locationListHeight = parseInt(
            getComputedStyle(dcStoreLocator.locationListContainer).height
        )
        const locationListWeight = parseInt(
            getComputedStyle(dcStoreLocator.locationListContainer).width
        )
        if (locationListHeight > 0 && locationListWeight > 0) {
            locationListContainer.style.display = visible ? 'block' : 'none'
        }
    }

    clearSelectedLocation() {
        this.locationListContainer.childNodes.forEach((child) => {
            child.classList.remove('dc-sl-location-selected')
        })
    }

    setSelectedLocationInList(locationId) {
        this.locationListContainer.childNodes.forEach((location) => {
            if (parseInt(location.dataset.locationId) === locationId) {
                location.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                })
                location.classList.add('dc-sl-location-selected')
            }
        })
    }
}

const dcStoreLocator = new DcStoreLocator()
dcStoreLocator.initApp()
