package com.bourbon_nook.users_api.config;

import org.springframework.amqp.core.FanoutExchange;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitConfig {
    public static final String USER_DELETE_EXCHANGE = "user.deleted.exchange";

    @Bean
    public FanoutExchange userDeleteExchange() {
        return new FanoutExchange(USER_DELETE_EXCHANGE, true, false);
    }
}
