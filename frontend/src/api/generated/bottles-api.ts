/**
 * Illustrative placeholder — shows the shape `orval` produces for an Axios client
 * (using the customInstance mutator) from bottles-api's live OpenAPI spec.
 * Replace this file for real by running the generator once the full stack
 * (config-server, discovery-service, RabbitMQ, MySQL, bottles-api) is up:
 *
 *   yarn generate:bottles-api
 */
import type { AxiosRequestConfig } from "axios";
import { customInstance } from "../axios-instance";

export type BottleStatus = "OPENED" | "SEALED" | "FINISHED";

export interface BottleResponseModel {
  id?: string;
  userId?: string;
  name?: string;
  type?: string;
  distillery?: string;
}

export interface CreateBottleRequest {
  name: string;
  type: string;
  status: BottleStatus;
  distillery: string;
  producer: string;
  country: string;
  region: string;
  price: number;
  age: string;
  proof: number;
  releaseYear: number;
  barrelInformation: string;
  finishing: string;
  imageUrl: string;
  openDate?: string;
  killDate?: string;
}

export type UserBottlesFilterParams = {
  name?: string;
  distillery?: string;
  producer?: string;
  minPrice?: number;
  maxPrice?: number;
};

export const userBottles = (options?: AxiosRequestConfig) => {
  return customInstance<BottleResponseModel[]>({ url: "/bottles", method: "GET", ...options });
};

export const userBottle = (bottleId: string, options?: AxiosRequestConfig) => {
  return customInstance<BottleResponseModel>({ url: `/bottles/${bottleId}`, method: "GET", ...options });
};

export const userBottlesFilter = (params?: UserBottlesFilterParams, options?: AxiosRequestConfig) => {
  return customInstance<BottleResponseModel[]>({ url: "/bottles/filter", method: "GET", params, ...options });
};

export const bottleCreate = (createBottleRequest: CreateBottleRequest, options?: AxiosRequestConfig) => {
  return customInstance<BottleResponseModel>({
    url: "/bottles/new",
    method: "POST",
    data: createBottleRequest,
    ...options,
  });
};

export const bottleUpdate = (
  bottleId: string,
  createBottleRequest: CreateBottleRequest,
  options?: AxiosRequestConfig,
) => {
  return customInstance<BottleResponseModel>({
    url: `/bottles/${bottleId}`,
    method: "PUT",
    data: createBottleRequest,
    ...options,
  });
};

export const bottleDelete = (bottleId: string, options?: AxiosRequestConfig) => {
  return customInstance<void>({ url: `/bottles/${bottleId}`, method: "DELETE", ...options });
};
