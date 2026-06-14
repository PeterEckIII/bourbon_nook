package com.bourbon_nook.api_gateway.api.gateway;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

public class PostFilter implements GlobalFilter, Ordered {
    final Logger logger = LoggerFactory.getLogger(PostFilter.class);

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        return chain.filter(exchange).then(Mono.fromRunnable(() -> {
            logger.info("Last post-filter executed...");
        }));
    }

    @Override
    public int getOrder() {
        return 0;
    }
}
