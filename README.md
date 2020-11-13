## Component Documentation

### Introduction

I have tried so many packages, but still can't find a suitable one for our project as there are many restrictions over there. Therefore, I decided to rewrite a Google Map component that 100% match our project.

The benefits of using this component:

- Exactly in line with our project
- The API of the component can be improved according to our own needs

### How to use this component

```
# Quick Start
$ git clone https://github.com/FgSurewin/google-map-learning.git
```

Create `.env.local` file inside the `src` file.

```
REACT_APP_API_KEY = "Enter your api key"
```

Now, you can run `npm start` or `yarn start` to start the project.

### Props

| Name                 | Type     | Description                                                                                                                                                                                                       |
| -------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| api                  | string   | API key for the google streetview. Can be found [here](https://developers.google.com/maps/documentation/javascript)                                                                                               |
| mainStyle            | object   | Border style                                                                                                                                                                                                      |
| streetViewOptions    | object   | streetViewOptions object used to define the properties of a `StreetViewPanorama` object. [More info](https://developers.google.com/maps/documentation/javascript/reference/street-view#StreetViewPanoramaOptions) |
| mapOptions           | object   | mapOptions object used to define the properties that can be set on a Map. [More info](https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions)                                       |
| events               | object   | Events object is used to combine all events. See below to get more information                                                                                                                                    |
| markers              | array    | Used to define markers on regular map                                                                                                                                                                             |
| labels               | array    | Used to define labels on street view                                                                                                                                                                              |
| labelMode            | boolean  | Used to switch to different mode                                                                                                                                                                                  |
| hadleStreetViewClick | function | This event is fired as long as you click the `streetView` container in **label mode**. I used this function to handle the label insertion.                                                                        |

#### events

All function showed below can be defined on the events object.

| Name              | Type     | Description                                                                                                                                                                                                         |
| ----------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| onPositionChanged | Function | This event is fired when the panorama's position changes. The position changes as the user navigates through the panorama or the position is set manually.                                                          |
| onPovChanged      | Function | This event is fired when the panorama's point-of-view changes. The point of view changes as the pitch, zoom, or heading changes.                                                                                    |
| onZoomChanged     | Function | This event is fired when the panorama's zoom level changes.                                                                                                                                                         |
| onPanoChanged     | Function | This event is fired when the panorama's pano id changes. The pano may change as the user navigates through the panorama or the position is manually set. Note that not all position changes trigger a pano_changed. |
| onVisibleChanged  | Function | This event is fired when the panorama's visibility changes. The visibility is changed when the Pegman is dragged onto the map, the close button is clicked.                                                         |

**Actually, I already combined all useful API together, and passed it into these functions as first parameter. The second parameter is map object that is a instance of google map (not street view panorama object).**

Since this is pure custom component, feel free to add whatever you want.[ Click here to get more info](https://developers.google.com/maps/documentation/javascript/reference/street-view#StreetViewPanoramaOptions)

```js
// Interface of first parameter
{
  pano : string,
  position: {
    lat: number,
    lng: number
  }
  pov: {
    heading:number,
    pitch:number,
    zoom:number
  }
}
```

> - `heading` (default `0`) defines the rotation angle around the camera locus in degrees relative from true north. Headings are measured clockwise (90 degrees is true east).
> - `pitch` (default `0`) defines the angle variance "up" or "down" from the camera's initial default pitch, which is often (but not always) flat horizontal. (For example, an image taken on a hill will likely exhibit a default pitch that is not horizontal.) Pitch angles are measured with positive values looking up (to +90 degrees straight up and orthogonal to the default pitch) and negative values looking down (to -90 degrees straight down and orthogonal to the default pitch).

#### markers

```js
// Interface of markers array
[
 {
    id: number,
    markerOptions: {
      position: {
        lat: number,
        lng: number,
      },
    },
  },
  ...
]
```

#### labels

```js
// Interface of labels array
[
  {
    id: number,
    position: {
      x: number,
      y: number,
    },
    color: string,
    pov: object,
  },
  ...
]
```

#### How to add custom event

More examples in `./src/OrinalMap/utils/streetViewTools.js`

```js
// Example
street.addListener("pano_changed", () => {
	if (events.onPanoChanged) {
		const result = generateInfo(
			street.getPano(),
			street.getPosition(),
			street.getPov()
		);
		events.onPanoChanged(result, map);
	}
});
```

## Problems

1. How to recognize the latitude and longitude of a certain position in the image?

As you can see, I already provided a solution to solve the label issue. Once you label the street view, the marker will be marked on the regular map simultaneously. However, the labels' positions didn't meet our expectations as they are replaced in the same location. The reason why this happens is that we keep saving the same latitude and longitude to our markers. So, the biggest problem we face is how to identify the approximate latitude and longitude of that certain position in the image.

2. How to "fix" the label in the 3D street view?

The basic idea to realize this effect is finding the relationship between the coordinate(x and y) and the information offered by the map, like pitch, heading, zoom, and so on.
