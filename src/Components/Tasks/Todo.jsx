import { useState } from "react";
import moment from "moment";
import { FaEye, FaPen, FaRegClock } from "react-icons/fa";
import { ImTarget } from "react-icons/im";
import { MdDeleteForever } from "react-icons/md";
import { TbSubtask } from "react-icons/tb";
import toast from "react-hot-toast";
import axios from "axios";
import { Droppable, Draggable } from "@hello-pangea/dnd";

const Todo = ({ tasks, refetch }) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");

  // Function to open modal and pre-fill input values
  const openModal = (task) => {
    setSelectedTask(task);
    setUpdatedTitle(task.title); // Set the default value for the title
    setUpdatedDescription(task.description || ""); // Set the default value for description
  };

  // Function to close modal
  const closeModal = () => {
    setSelectedTask(null);
  };

  // Handle title and description changes
  const handleTitleChange = (e) => setUpdatedTitle(e.target.value);
  const handleDescriptionChange = (e) => setUpdatedDescription(e.target.value);

  // Handle updating the task
  const handleUpdate = () => {
    axios
      .put(
        `https://task-tracker-servers.vercel.app/tasks/${selectedTask._id}?addedBy=${selectedTask.addedBy}`,
        {
          title: updatedTitle,
          description: updatedDescription,
          category: selectedTask.category,
          addedBy: selectedTask.addedBy,
        }
      )
      .then((res) => {
        toast.success("Task updated successfully");
        refetch();
        closeModal();
      })
      .catch((err) => {
        toast.error("Failed to update task");
      });
  };

  // delete
  const handleDelete = (taskId, addedBy) => {
    axios
      .delete(`https://task-tracker-servers.vercel.app/tasks/${taskId}?addedBy=${addedBy}`)
      .then((res) => {
        refetch();
        toast.success("Task deleted successfully");
      })
      .catch((err) => {
        toast.error("Failed to delete task");
      });
  };

  return (
    <div className="md:w-2/6">
      {/* Title */}
      <div className="text-xl md:text-2xl text-red-700 lg:text-3xl font-bold flex justify-center items-center gap-2 mb-5">
        {/* <p>
          <ImTarget />
        </p> */}
        <p className="hover:underline">To-Do Category</p>
      </div>

      <Droppable droppableId="todo">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-4 min-h-[400px]"
          >
            {tasks?.map((task, index) => (
              <Draggable key={task._id} draggableId={task._id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`border-2 border-red-200 bg-slate-200 dark:bg-medium p-2 rounded-md flex gap-2 flex-col 
                                            
                                            ${snapshot.isDragging
                        ? "opacity-75"
                        : ""
                      }`}
                  >
                    {/* Title */}
                    <div className="font-medium text-lg flex gap-1 items-center dark:text-white">
                      <p>
                        <TbSubtask />
                      </p>
                      <p className="font-bold">Title:{task.title}</p>
                    </div>

                    {/* Time */}
                    <div className="text-md flex gap-1 items-center dark:text-white">
                      <p>
                        <FaRegClock />
                      </p>
                      <p>{moment(task.timestamp).format("MMM D YYYY")}</p>
                    </div>

                    <div className="flex justify-between items-center">
                      {/* Description Button */}
                      <div
                        className="flex gap-1 items-center text-info cursor-pointer"
                        onClick={() => openModal(task)}
                      >

                        <p className="text-sm text-gray-700 dark:text-white">Description : {task.description}</p>
                      </div>

                      <div className="flex gap-2 items-center ml-4">
                        {/* Edit Button */}
                        <button onClick={() => openModal(task)}
                          className="btn bg-gray-800 text-green-700"
                        >
                          <FaPen className="text-green-500 text-lg" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(task._id, task.addedBy)}
                          className="btn bg-gray-800 text-red-700"
                        >
                          <MdDeleteForever className="text-2xl text-error" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {/* Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 dark:bg-medium">
            <h2 className="text-xl font-bold mb-2">Edit Task</h2>

            {/* Title Input */}
            <div className="mb-4">
              <label
                htmlFor="title"
                className="block text-gray-700 font-semibold dark:text-white"
              >
                Title
              </label>
              <input
                id="title"
                type="text"
                required
                value={updatedTitle}
                onChange={handleTitleChange}
                className="w-full p-2 border border-gray-300 rounded-md text-black"
              />
            </div>

            {/* Description Input */}
            <div className="mb-4">
              <label
                htmlFor="description"
                className="block text-gray-700 font-semibold dark:text-white"
              >
                Description
              </label>
              <textarea
                id="description"
                value={updatedDescription}
                required
                onChange={handleDescriptionChange}
                className="w-full p-2 border border-gray-300 rounded-md text-black"
                rows="4"
              />
            </div>

            {/* Modal Buttons */}
            <div className="flex justify-between">
              <button
                onClick={closeModal}
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
              >
                Close
              </button>
              <button
                onClick={handleUpdate}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Todo;
