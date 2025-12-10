import instance from "./config";

export function getRestaurants() {
  return instance.get("/admin/restaurants");
}

export function createRestaurant(data) {
  return instance.post("/admin/restaurants", data);
}
