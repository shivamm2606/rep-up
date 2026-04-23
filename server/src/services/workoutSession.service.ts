import WorkoutSession from "../models/workoutSession.model.js";
import {
  IWorkoutSessionService,
  CreateSessionDto,
  AddExerciseToSessionDto,
  LogSetDto,
} from "../types/workout.service.interfaces.js";
import { IWorkoutSession } from "../types/workout.types.js";
import { ApiError } from "../utils/apiError.js";

class MongoWorkoutSessionService implements IWorkoutSessionService {
  createSession = async (
    userId: string,
    dto: CreateSessionDto,
  ): Promise<IWorkoutSession> => {
    const name = dto.name ?? `Session - ${new Date().toLocaleDateString()}`;
    const { templateUsed, notes } = dto;

    const createdSession = await WorkoutSession.create({
      userId,
      name,
      templateUsed,
      notes,
      status: "active",
      date: Date.now(),
      exercises: [],
    });

    return createdSession;
  };

  addExerciseToSession = async (
    sessionId: string,
    userId: string,
    dto: AddExerciseToSessionDto,
  ): Promise<IWorkoutSession> => {
    const session = await WorkoutSession.findById(sessionId);

    if (!session) {
      throw new ApiError(400, "Session not found");
    }

    if (!session.userId.equals(userId)) {
      throw new ApiError(403, "Unauthorized");
    }

    session.exercises.push({
      exerciseId: dto.exerciseId,
      notes: dto.notes,
      sets: [],
    });

    await session.save();

    return session;
  };

  logSet = async (
    sessionId: string,
    userId: string,
    dto: LogSetDto,
  ): Promise<IWorkoutSession> => {
    const session = await WorkoutSession.findById(sessionId);

    if (!session) {
      throw new ApiError(400, "Session not found");
    }

    if (!session.userId.equals(userId)) {
      throw new ApiError(403, "Unauthorized");
    }

    const exercise = session.exercises.find((e) =>
      e.exerciseId.equals(dto.exerciseId),
    );

    if (!exercise) {
      throw new ApiError(400, "Exercise not found");
    }

    const { exerciseId, ...setData } = dto;

    exercise.sets.push(setData);

    await session.save();

    return session;
  };

  completeSession = async (
    sessionId: string,
    userId: string,
  ): Promise<IWorkoutSession> => {
    const session = await WorkoutSession.findById(sessionId);

    if (!session) {
      throw new ApiError(400, "Session not found");
    }

    if (!session.userId.equals(userId)) {
      throw new ApiError(403, "Unauthorized");
    }

    const duration = Math.round(
      (Date.now() - session.date.getTime()) / 1000 / 60,
    );

    session.status = "completed";
    session.duration = duration;

    await session.save();

    return session;
  };

  getSessionById = async (
    sessionId: string,
    userId: string,
  ): Promise<IWorkoutSession | null> => {
    const session = await WorkoutSession.findById(sessionId);

    if (!session) {
      throw new ApiError(400, "Session not found");
    }

    if (!session.userId.equals(userId)) {
      throw new ApiError(403, "Unauthorized");
    }

    return session;
  };

  getUserSessions = async (
    userId: string,
    page: number,
    limit: number,
  ): Promise<{
    sessions: IWorkoutSession[];
    total: number;
    page: number;
    limit: number;
  }> => {
    const skip = (page - 1) * limit;

    const sessions = await WorkoutSession.find({ userId })
      .skip(skip)
      .limit(limit);

    const total = await WorkoutSession.countDocuments({ userId });

    return { sessions, total, page, limit };
  };

  deleteSession = async (sessionId: string, userId: string): Promise<void> => {
    const session = await WorkoutSession.findById(sessionId);

    if (!session) {
      throw new ApiError(400, "Session not found");
    }

    if (!session.userId.equals(userId)) {
      throw new ApiError(403, "Unauthorized");
    }

    await session.deleteOne();

    return;
  };

  removeExerciseFromSession = async (
    sessionId: string,
    userId: string,
    exerciseId: string,
  ): Promise<IWorkoutSession> => {
    const session = await WorkoutSession.findById(sessionId);

    if (!session) {
      throw new ApiError(400, "Session not found");
    }

    if (!session.userId.equals(userId)) {
      throw new ApiError(403, "Unauthorized");
    }

    session.exercises = session.exercises.filter(
      (e) => !e.exerciseId.equals(exerciseId),
    );

    await session.save();

    return session;
  };

  removeSetFromSession = async (
    sessionId: string,
    userId: string,
    exerciseId: string,
    setIndex: number,
  ): Promise<IWorkoutSession> => {
    const session = await WorkoutSession.findById(sessionId);

    if (!session) {
      throw new ApiError(400, "Session not found");
    }

    if (!session.userId.equals(userId)) {
      throw new ApiError(403, "Unauthorized");
    }

    const exercise = session.exercises.find((e) =>
      e.exerciseId.equals(exerciseId),
    );

    if (!exercise) {
      throw new ApiError(400, "Exercise not found");
    }

    exercise.sets.splice(setIndex, 1);

    await session.save();

    return session;
  };
}

export default new MongoWorkoutSessionService();
