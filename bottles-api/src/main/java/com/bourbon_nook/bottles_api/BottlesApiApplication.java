package com.bourbon_nook.bottles_api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class BottlesApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(BottlesApiApplication.class, args);
	}

}
