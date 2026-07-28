package com.bourbon_nook.bottles_api.listeners;

import com.bourbon_nook.bottles_api.config.RabbitConfig;
import com.bourbon_nook.bottles_api.models.events.UserDeletedEvent;
import com.bourbon_nook.bottles_api.repositories.BottleRepository;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class UserDeleteListener {
    private final BottleRepository bottleRepository;

    public UserDeleteListener(BottleRepository bottleRepository) {
        this.bottleRepository = bottleRepository;
    }

    @RabbitListener(queues = RabbitConfig.QUEUE)
    public void onUserDeleted(UserDeletedEvent event) {
        bottleRepository.deleteAllByUserId(event.getUserId());
    }
}
