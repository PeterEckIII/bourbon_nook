package com.bourbon_nook.reviews_api.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.FanoutExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitConfig {
    public static final String QUEUE = "reviews-api.user-deleted.queue";

    @Bean
    FanoutExchange userDeletedExchange() {
        return new FanoutExchange("user.deleted.exchange", true, false);
    }

    @Bean
    Queue userDeletedQueue() {
        return new Queue(QUEUE, true);
    }

    @Bean
    Binding binding(Queue userDeletedQueue, FanoutExchange userDeletedExchange) {
        return BindingBuilder.bind(userDeletedQueue).to(userDeletedExchange);
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }
}
