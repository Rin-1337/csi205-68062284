"use client";

import { Toggle } from "@/components/tailgrids/core/toggle";

import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/tailgrids/core/native-select";

import {
  TableRoot,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/tailgrids/core/table";

import {
  Modal,
  ModalOverlay,
  Dialog,
  Heading,
  TextField,
  Label,
  Input,
} from "react-aria-components";

import { Spinner } from "@/components/tailgrids/core/spinner";
import { Pagination } from "@/components/tailgrids/core/pagination";
import { useEffect, useState } from "react";
import { Button } from "@/components/tailgrids/core/button";
import { Check, ClockThree, Plus, Trash1 } from "@tailgrids/icons";
import { Badge } from "@/components/tailgrids/core/badge";

import { fetchTodos } from "../data/todos";
import type { TodoType } from "../data/todos";

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);
  const [todosRaw, setTodosRaw] = useState<TodoType[]>([]);
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [filter, setFilter] = useState(false);

  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isAddOpen, setAddOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  // Onload
  useEffect(() => {
    fetchTodos()
      .then((data) => setTodosRaw(data as TodoType[]))
      // .catch((error) => setTodosRaw([]))
      .finally(() => setIsLoading(false));
  }, []);
  // todoRaw, filter => [] => todos
  useEffect(() => {
    filter
      ? setTodos(todosRaw.filter((todo) => todo.completed === false))
      : setTodos(todosRaw);
  }, [todosRaw, filter]);

  // todos, itemsPerPage => [] => totalPages
  useEffect(() => {
    setTotalPages(Math.ceil(todos.length / itemsPerPage));
  }, [todos, itemsPerPage]);

  useEffect(() => {
    if (totalPages > 0) {
      if (currentPage <= 0) setCurrentPage(1);
      else if (currentPage > totalPages) setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const markDone = (id: number) => {
    setTodosRaw((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: true } : t)),
    );
  };

  const deleteTodo = (id: number) => {
    setTodosRaw((prev) => prev.filter((t) => t.id !== id));
  };

  // Press Add button to open modal
  const openAddModal = () => {
    setNewTitle("");
    setAddOpen(true);
  };

  // Press Add button in modal to Add new Todo
  const AddTodo = () => {
    const title = newTitle.trim();
    if (title === "") return;

    setTodosRaw((prev) => {
      const maxId = prev.reduce((max, t) => Math.max(max, t.id), 0);
      const newTodo: TodoType = {
        userId: 1,
        id: maxId + 1,
        title: title.trim(),
        completed: false,
      };
      return [newTodo, ...prev];
    });
    setCurrentPage(1);
    setAddOpen(false);
  };

  return (
    // todos container
    <div className="mt-4 px-2 max-w-3xl mx-auto">
      {/* cotroller */}
      <div className="flex justify-between">
        {/* toggle */}
        <div className="flex items-center">
          <Toggle
            label="Show only"
            checked={filter}
            onChange={(e) => setFilter(e.target.checked)}
          />
          &nbsp;
          <Button
            size="sm"
            className="h-8 p-2 bg-yellow-500 pointer-events-none"
          >
            Waiting
            <ClockThree />
          </Button>
        </div>

        {/* dropdown */}
        <div>
          <NativeSelect
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
          >
            <NativeSelectOption value={5}>5 items per page</NativeSelectOption>
            <NativeSelectOption value={10}>
              10 items per page
            </NativeSelectOption>
            <NativeSelectOption value={50}>
              50 items per page
            </NativeSelectOption>
          </NativeSelect>
        </div>
      </div>

      {/* table */}
      <div className="mt-1">
        <TableRoot>
          <TableHeader>
            <TableRow className="bg-black text-white">
              <TableHead className="w-24 font-bold text-right">ID</TableHead>
              <TableHead className="font-bold text-center">Title</TableHead>
              <TableHead className="font-bold flex justify-end items-center gap-1">
                Completed
                <Button
                  variant={"primary"}
                  className="h-8 p-2"
                  onPress={openAddModal}
                >
                  <Plus />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>

          {/* show spinner while loading */}
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={3}>
                  <Spinner className="mx-auto" />
                </TableCell>
              </TableRow>
            )}

            {!isLoading && todos.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-red-500">
                  No data, Maybe connection refused (Reload again)
                </TableCell>
              </TableRow>
            )}

            {/* render data */}
            {todos
              .filter((todo, index) => {
                const lower = (currentPage - 1) * itemsPerPage;
                const upper = currentPage * itemsPerPage - 1;
                return index >= lower && index <= upper;
              })
              .map((todo) => {
                return (
                  <TableRow key={todo.id}>
                    <TableCell className="text-right">
                      <Badge
                        size={"lg"}
                        className="rounded-lg bg-gray-500 text-white font-bold"
                      >
                        {todo.id}
                      </Badge>
                    </TableCell>
                    <TableCell>{todo.title}</TableCell>
                    <TableCell className="flex justify-end gap-1">
                      {todo.completed ? (
                        <Button
                          size="sm"
                          className="h-8 bg-green-700 text-white pointer-events-none"
                        >
                          Done
                          <Check />
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          className="h-8 bg-yellow-500 hover:bg-yellow-700 hover:text-white cursor-pointer p-2"
                          onPress={() => markDone(todo.id)}
                        >
                          Waiting
                          <ClockThree />
                        </Button>
                      )}

                      <Button
                        variant="danger"
                        className="h-8 p-2"
                        onPress={() => deleteTodo(todo.id)}
                      >
                        <Trash1 />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </TableRoot>
      </div>

      {/* pagination */}
      {todos.length > 0 && (
        <div className="mt-1 w-1/3 mx-auto flex justify-center items-center gap-1">
          <Button
            size="sm"
            appearance={"outline"}
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1} // currentPage != totalPages just a some stupid brain dead work
          >
            First
          </Button>
          <div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              sideLayout="icon"
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
          <Button
            size="sm"
            appearance={"outline"}
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            Last
          </Button>
        </div>
      )}
      {/* add todo modal */}
      <ModalOverlay
        isOpen={isAddOpen}
        onOpenChange={setAddOpen}
        isDismissable
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      >
        <Modal className="w-full max-w-md rounded-2xl bg-white shadow-2xl outline-none">
          <Dialog className="p-6 outline-none">
            {({ close }) => (
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                    <Plus />
                  </div>
                  <div>
                    <Heading
                      slot="title"
                      className="text-lg font-bold text-title-50"
                    >
                      Add new todo
                    </Heading>
                    <p className="text-sm text-text-100">
                      What do you need to get done?
                    </p>
                  </div>
                </div>

                <TextField
                  autoFocus
                  value={newTitle}
                  onChange={setNewTitle}
                  className="mt-5 flex flex-col gap-1"
                >
                  <Label className="text-sm font-medium text-text-50">
                    Title
                  </Label>
                  <Input
                    placeholder="e.g. Finish CSI205 homework"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") AddTodo();
                    }}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-text-50 outline-none focus:border-primary-500 focus:ring-3 focus:ring-primary-200"
                  />
                </TextField>

                <div className="mt-6 flex justify-end gap-2">
                  <Button appearance="outline" onPress={close}>
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onPress={AddTodo}
                    disabled={newTitle.trim() === ""}
                  >
                    Add
                  </Button>
                </div>
              </div>
            )}
          </Dialog>
        </Modal>
      </ModalOverlay>
    </div>
  );
}
