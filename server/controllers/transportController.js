const riders = await Rider.find({
    isAvailable: true,
    currentLocation: {
        $near: {
            $geometry: { type: "Point", coordinates: [customerLng, customerLat] },
            $maxDistance: 5000 // 5km radius
        }
    }
});