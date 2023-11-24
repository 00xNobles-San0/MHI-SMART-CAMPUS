import ParkingSpaceService from "../services/parkingspace"

const space = new ParkingSpaceService()
for (let i = 1; i < 10; i++) {
    space.createParkingSpace({
        status:"empty",
        location:"A"+i,
        type:"car"
    })
}