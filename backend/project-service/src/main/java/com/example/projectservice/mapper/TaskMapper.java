package com.example.projectservice.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import com.example.projectservice.dto.TaskDTO;
import com.example.projectservice.model.Task;

@Mapper(componentModel = "spring")
public interface TaskMapper {

    TaskDTO toDto(Task task);
    
    @Mapping(target = "project", ignore = true) // <-- important !
    Task toEntity(TaskDTO dto);

    List<TaskDTO> toDtoList(List<Task> tasks);
}
