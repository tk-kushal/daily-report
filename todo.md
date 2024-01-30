make the theme more standard and appealing

~implement a light theme~

~add a custom light and dark theme button~

~fix the month date loading issue~

add more font options for the text box

add a full-screen type of thing for the report, and maybe rethink the UI.

and yes, please make it a PWA as soon as possible.

~Fixing the data fetching issue~

make and add a logo for the application and find a way to convert it into a PWA

can add color theme options by adjusting the hue of the background using filter

Need to find a pwa generator website or use the pwa generator NPM package to generate the assets for the manifest file.

add a dedicated notes section and a analysis page

change the architecture to use a different document for current editable copy and only append the day's data to the month bundle on the next day, this is to avoid any accidental overwrite like today.

add a streak feature for the tracked fields, this seems simple but it really depends on the architecture, if we use the naive method we can calculate the streak but we have to bring in all the records and calculate the streak on the spot, this is very in-effecient as it defeats the purpose of not calling all the data at once, the other method is to calculate the data once and save it to the cache if someone misses for one day the streak will be broken, this can be achieved by on client side or on server side with cloud functions of (Lambda functions) if we are using AWS, we can cache results upto yesterday and clculate the latest results based ont he yesterdays, we should also store the (last-interectat/last-tracked) time of each field to more easily calculate the current streak and to tell if the streak is broken. This sollution will be very fast and network indipendent, truly a brilliant sollution.