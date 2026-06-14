package com.bourbon_nook.api_gateway.api.gateway;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import reactor.core.publisher.Mono;

@Configuration
public class GlobalFiltersConfiguration {
    final Logger logger = LoggerFactory.getLogger(GlobalFiltersConfiguration.class);

    @Order(1)
    @Bean
    public GlobalFilter secondPreFilter() {
        return (exchange, chain) -> {
            logger.info("Second global pre-filter is executed");

            return chain.filter(exchange).then(Mono.fromRunnable(() -> {
                logger.info("Third post-filter executed...");
            }));
        };
    }

    @Order(2)
    @Bean
    public GlobalFilter thirdPreFilter() {
        return (exchange, chain) -> {
            logger.info("Third pre-filter is executed...");

            return chain.filter(exchange).then(Mono.fromRunnable(() -> {
                logger.info("Second post-filter executed...");
            }));
        };
    }

    @Order(3)
    @Bean
    public GlobalFilter fourthPreFilter() {
        return (exchange, chain) -> {
            logger.info("Fourth pre-filter is executed...");

            return chain.filter(exchange).then(Mono.fromRunnable(() -> {
                logger.info("First post-filter executed...");
            }));
        };
    }
}
