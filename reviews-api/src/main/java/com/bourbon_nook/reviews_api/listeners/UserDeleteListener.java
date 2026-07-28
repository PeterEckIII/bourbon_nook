package com.bourbon_nook.reviews_api.listeners;

import com.bourbon_nook.reviews_api.config.RabbitConfig;
import com.bourbon_nook.reviews_api.models.events.UserDeletedEvent;
import com.bourbon_nook.reviews_api.repositories.NoteRepository;
import com.bourbon_nook.reviews_api.repositories.ReviewRepository;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class UserDeleteListener {
    private final ReviewRepository reviewRepository;
    private final NoteRepository noteRepository;

    public UserDeleteListener(ReviewRepository reviewRepository, NoteRepository noteRepository) {
        this.reviewRepository = reviewRepository;
        this.noteRepository = noteRepository;
    }

    @RabbitListener(queues = RabbitConfig.QUEUE)
    public void onUserDeleted(UserDeletedEvent event) {
        reviewRepository.deleteAllByUserId(event.getUserId());
        noteRepository.deleteByCreatedBy(event.getUserId());
    }
}
