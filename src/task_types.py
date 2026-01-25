"""Task type definitions and constants."""

from enum import Enum
from typing import Dict, Any


class TaskType(Enum):
    """Supported task types for message processing."""

    GENERATE_XML_FROM_INPUT = "generate_xml_from_input"
    GENERATE_VOICES_FROM_XML = "generate_voices_from_xml"


# Task type to file type mapping
TASK_TYPE_TO_INPUT_FILE_TYPES = {
    TaskType.GENERATE_XML_FROM_INPUT: [
        "ORIGINAL_PDF",
        "ORIGINAL_PNG",
        "ORIGINAL_JPG",
        "ORIGINAL_JPEG",
    ],
    TaskType.GENERATE_VOICES_FROM_XML: ["MUSIC_XML"],
}

# Task type to processor name mapping
TASK_TYPE_TO_PROCESSOR = {
    TaskType.GENERATE_XML_FROM_INPUT: "xml_from_input_processor",
    TaskType.GENERATE_VOICES_FROM_XML: "voices_from_xml_processor",
}

# Task type to output file type mapping
TASK_TYPE_TO_OUTPUT_FILE_TYPES = {
    TaskType.GENERATE_XML_FROM_INPUT: ["MUSIC_XML"],
    TaskType.GENERATE_VOICES_FROM_XML: ["VOICE_1", "VOICE_2", "VOICE_3"],
}


def validate_task_message(message: Dict[str, Any]) -> None:
    """
    Validate a task message structure.

    Args:
        message: The message to validate.

    Raises:
        ValueError: If message structure is invalid.
    """
    required_fields = ["job_id", "task_type", "task_params"]

    for field in required_fields:
        if field not in message:
            raise ValueError(f"Message missing required field: {field}")

    # Validate task_type
    try:
        TaskType(message["task_type"])
    except ValueError:
        valid_types = [t.value for t in TaskType]
        raise ValueError(
            f"Invalid task_type: {message['task_type']}. Valid types: {valid_types}"
        )

    # Validate task_params structure
    task_params = message["task_params"]
    if not isinstance(task_params, dict):
        raise ValueError("task_params must be a dictionary")

    if "input_key" not in task_params:
        raise ValueError("task_params missing required field: input_key")

    if not isinstance(task_params["input_key"], str):
        raise ValueError("input_key must be a string")


def get_task_input_file_types(task_type: str) -> list:
    """
    Get supported input file types for a task type.

    Args:
        task_type: The task type string.

    Returns:
        List of supported file types.

    Raises:
        ValueError: If task_type is invalid.
    """
    try:
        enum_type = TaskType(task_type)
        return TASK_TYPE_TO_INPUT_FILE_TYPES[enum_type]
    except KeyError:
        raise ValueError(f"Unknown task_type: {task_type}")


def get_task_processor_name(task_type: str) -> str:
    """
    Get processor name for a task type.

    Args:
        task_type: The task type string.

    Returns:
        Processor name string.

    Raises:
        ValueError: If task_type is invalid.
    """
    try:
        enum_type = TaskType(task_type)
        return TASK_TYPE_TO_PROCESSOR[enum_type]
    except KeyError:
        raise ValueError(f"Unknown task_type: {task_type}")


def get_task_output_file_types(task_type: str) -> list:
    """
    Get expected output file types for a task type.

    Args:
        task_type: The task type string.

    Returns:
        List of expected output file types.

    Raises:
        ValueError: If task_type is invalid.
    """
    try:
        enum_type = TaskType(task_type)
        return TASK_TYPE_TO_OUTPUT_FILE_TYPES[enum_type]
    except KeyError:
        raise ValueError(f"Unknown task_type: {task_type}")
