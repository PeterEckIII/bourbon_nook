package com.bourbon_nook.bottles_api.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.FanoutExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitConfig {
    public static final String QUEUE = "bottles-api.user-deleted.queue";

    @Bean
    FanoutExchange userDeleteExchange() {
        return new FanoutExchange("user.deleted.exchange", true, false);
    }

    @Bean
    Queue userDeleteQueue() {
        return new Queue(QUEUE, true);
    }

    @Bean
    Binding binding(Queue userDeleteQueue, FanoutExchange userDeleteExchange) {
        return BindingBuilder.bind(userDeleteQueue).to(userDeleteExchange);
    }
}
