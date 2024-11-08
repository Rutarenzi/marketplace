import { ApiResponse } from "@nestjs/swagger";

// Modify to return a function that applies decorators
export function ApiProfileResponses() {
  return function (target: any, key?: string, descriptor?: PropertyDescriptor) {
    ApiResponse({ status: 200, description: "Profile retrieved successfully" })(target, key, descriptor);
    ApiResponse({ status: 404, description: "Profile not found" })(target, key, descriptor);
  };
}

export const ApiProfileCreateResponses = () => {
  return function (target: any, key?: string, descriptor?: PropertyDescriptor) {
    ApiResponse({ status: 201, description: "Profile created successfully" })(target, key, descriptor);
    ApiResponse({ status: 400, description: "Bad request" })(target, key, descriptor);
  };
};
