package com.bourbon_nook.api_gateway.api.gateway;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import javax.crypto.SecretKey;
import java.util.Base64;

@Component
public class AuthorizationHeaderFilter extends AbstractGatewayFilterFactory<AuthorizationHeaderFilter.Config> {

    private final Environment environment;

    public AuthorizationHeaderFilter(Environment environment) {
        super(Config.class);
        this.environment = environment;
    }

    public static class Config {
    // Config properties go here
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            ServerHttpRequest request = exchange.getRequest();

            if(!request.getHeaders().containsKey(HttpHeaders.AUTHORIZATION)) {
                return onError(exchange, "No authorization header");
            }

            String authorizationHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
            assert authorizationHeader != null;
            String jwt = authorizationHeader.replace("Bearer", "").trim();

            if(!isJwtValid(jwt)) {
                return onError(exchange, "Invalid JWT token");
            }

            return chain.filter(exchange);
        };
    }

    private Mono<Void> onError(ServerWebExchange exchange, String err) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(HttpStatus.UNAUTHORIZED);

        return response.setComplete();
    }

    private boolean isJwtValid(String jwt) {
        boolean isValid = true;

        String subject = null;
        String tokenSecret = environment.getProperty("token.secret");
        assert tokenSecret != null;
        byte[] secretKeyBytes = Base64.getDecoder().decode(tokenSecret);

        SecretKey signingKey = Keys.hmacShaKeyFor(secretKeyBytes);

        JwtParser jwtParser = Jwts.parserBuilder()
                .setSigningKey(signingKey)
                .build();

        try {
            Claims claims = jwtParser.parseClaimsJws(jwt).getBody();
            subject = (String) claims.get("sub");
        } catch (Exception ex) {
            isValid = false;
        }

        if(subject == null || subject.isEmpty()) {
            isValid = false;
        }

        return isValid;
    }
}
