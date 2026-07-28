package com.bourbon_nook.users_api.services;

import com.bourbon_nook.users_api.config.RabbitConfig;
import com.bourbon_nook.users_api.dtos.UserDto;
import com.bourbon_nook.users_api.entities.RoleEntity;
import com.bourbon_nook.users_api.entities.UserEntity;
import com.bourbon_nook.users_api.enums.RoleType;
import com.bourbon_nook.users_api.models.events.UserDeletedEvent;
import com.bourbon_nook.users_api.models.requests.UpdateUserRequest;
import com.bourbon_nook.users_api.repositories.RoleRepository;
import com.bourbon_nook.users_api.repositories.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final ModelMapper modelMapper;
    private final RabbitTemplate rabbitTemplate;

    public UserServiceImpl(UserRepository userRepository,
                           RoleRepository roleRepository,
                           BCryptPasswordEncoder bCryptPasswordEncoder,
                           ModelMapper modelMapper,
                           RabbitTemplate rabbitTemplate
    ) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.modelMapper = modelMapper;
        this.rabbitTemplate = rabbitTemplate;
    }

    @Override
    public UserDto getUserByUserId(String userId) {
        UserEntity userEntity = userRepository.findByUserId(userId);
        if (userEntity == null) throw new UsernameNotFoundException("User not found");

        return modelMapper.map(userEntity, UserDto.class);
    }

    @Override
    public List<UserDto> getUsers() {
        List<UserEntity> userEntities = userRepository.findAll();
        return userEntities
                .stream()
                .map(userEntity -> modelMapper.map(userEntity, UserDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public UserDto getUserDetailsByEmail(String email) {
        UserEntity user = userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException(email));
        return modelMapper.map(user, UserDto.class);
    }

    @Transactional
    @Override
    public UserDto createUser(UserDto userDetails, String rawPassword) {
        userDetails.setUserId(UUID.randomUUID().toString());
        UserEntity userEntity = modelMapper.map(userDetails, UserEntity.class);
        userEntity.setEncryptedPassword(bCryptPasswordEncoder.encode(rawPassword));
        userEntity.setRoles(Set.of(getOrCreateRole(RoleType.USER)));

        userRepository.save(userEntity);

        return modelMapper.map(userEntity, UserDto.class);
    }

    @Override
    public UserDto updateUser(String userId, UpdateUserRequest userDetails) {
        UserEntity user =  userRepository.findByUserId(userId);
        if (user == null) throw new UsernameNotFoundException("User not found");
        user.setEmail(userDetails.getEmail());
        user.setUsername(userDetails.getUsername());
        userRepository.save(user);
        return modelMapper.map(user, UserDto.class);
    }

    @Override
    public void deleteUser(String userId) {
        UserEntity user = userRepository.findByUserId(userId);
        if (user == null) throw new UsernameNotFoundException("User not found");
        userRepository.delete(user);
        rabbitTemplate.convertAndSend(RabbitConfig.USER_DELETE_EXCHANGE, "", new UserDeletedEvent(userId));
    }

    private RoleEntity getOrCreateRole(RoleType roleType) {
        return roleRepository.findByName(roleType)
                .orElseGet(() -> roleRepository.save(new RoleEntity(roleType)));
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserEntity user = userRepository.findByEmail(username).orElseThrow(() -> new UsernameNotFoundException(username));
        List<GrantedAuthority> authorities = user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role.getName()))
                .collect(Collectors.toList());
        // Third argument can be set to false if you want to have the user verify their email address
        return new User(
                user.getEmail(),
                user.getEncryptedPassword(),
                true,
                true,
                true,
                true,
                authorities
        );
    }
}
