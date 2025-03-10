import { Task } from '../types';
import { 
  Crown, 
  Calendar, 
  Clock,
  BookOpen,
  PenSquare,
  Presentation,
  Beaker,
  Microscope,
  Activity,
  FileText,
  Building,
  Users,
  GraduationCap,
  Tag
} from 'lucide-react';
import { isOverdue } from '../utils/dateUtils';
import { parseLinks } from '../utils/linkParser';
import { useState } from 'react';
import { TaskDetailsPopup } from './task/TaskDetailsPopup';

interface TaskListProps {
  tasks: Task[];
  onDeleteTask?: (taskId: string) => void;
  showDeleteButton?: boolean;
}

export function TaskList({ tasks, onDeleteTask, showDeleteButton = false }: TaskListProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'quiz':
        return <BookOpen className="w-3.5 h-3.5" />;
      case 'assignment':
        return <PenSquare className="w-3.5 h-3.5" />;
      case 'presentation':
        return <Presentation className="w-3.5 h-3.5" />;
      case 'lab-report':
        return <Beaker className="w-3.5 h-3.5" />;
      case 'lab-final':
        return <Microscope className="w-3.5 h-3.5" />;
      case 'lab-performance':
        return <Activity className="w-3.5 h-3.5" />;
      case 'documents':
        return <FileText className="w-3.5 h-3.5" />;
      case 'blc':
        return <Building className="w-3.5 h-3.5" />;
      case 'groups':
        return <Users className="w-3.5 h-3.5" />;
      default:
        return <GraduationCap className="w-3.5 h-3.5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'quiz':
        return 'text-blue-600 dark:text-blue-400';
      case 'assignment':
        return 'text-orange-600 dark:text-orange-400';
      case 'presentation':
        return 'text-red-600 dark:text-red-400';
      case 'lab-report':
        return 'text-green-600 dark:text-green-400';
      case 'lab-final':
        return 'text-purple-600 dark:text-purple-400';
      case 'lab-performance':
        return 'text-pink-600 dark:text-pink-400';
      case 'documents':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'blc':
        return 'text-cyan-600 dark:text-cyan-400';
      case 'groups':
        return 'text-teal-600 dark:text-teal-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12 animate-fade-in">
        <img
          src="https://images.unsplash.com/photo-1496115965489-21be7e6e59a0?auto=format&fit=crop&q=80&w=400"
          alt="Empty tasks"
          className="w-32 h-32 sm:w-48 sm:h-48 object-cover rounded-2xl mx-auto mb-4 opacity-50 shadow-lg"
        />
        <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg font-medium">No tasks found in this category</p>
        <p className="text-gray-400 dark:text-gray-500 mt-2 text-sm sm:text-base">Time to add some new tasks!</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto bg-gray-50 dark:bg-gray-900 md:bg-transparent">
      {/* Mobile-optimized container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-3 md:gap-4 lg:gap-6 md:p-4 lg:p-6">
        {tasks.map((task, index) => {
          const overdue = isOverdue(task.dueDate);
          return (
            <div
              key={task.id}
              onClick={() => setSelectedTask(task)}
              className={`relative bg-white dark:bg-gray-800 md:bg-gradient-to-br md:from-white md:to-gray-50/80 md:dark:from-gray-800 md:dark:to-gray-900/90
                rounded-2xl md:rounded-lg
                shadow-sm md:hover:shadow-lg
                border border-gray-100 dark:border-gray-700/50
                p-4 md:p-4 lg:p-5
                transition-all duration-300 ease-in-out
                active:scale-[0.98] md:active:scale-100 md:hover:-translate-y-1
                active:bg-gray-50/80 dark:active:bg-gray-800/70 md:active:bg-gradient-to-br
                touch-manipulation md:touch-auto
                ${task.status === 'completed'
                  ? 'md:border-green-200/80 md:dark:border-green-900/80 bg-gradient-to-br from-green-50/90 via-green-50/50 to-white dark:from-green-900/20 dark:via-green-900/10 dark:to-transparent md:from-green-50 md:to-white md:dark:from-green-900/20 md:dark:to-gray-900/90'
                  : overdue
                    ? 'md:border-red-200/80 md:dark:border-red-900/80 bg-gradient-to-br from-red-50/90 via-red-50/50 to-white dark:from-red-900/20 dark:via-red-900/10 dark:to-transparent md:from-red-50 md:to-white md:dark:from-red-900/20 md:dark:to-gray-900/90'
                    : 'md:border-sky-100 md:dark:border-sky-800/30 md:hover:border-sky-200 md:dark:hover:border-sky-700/50'}
                motion-safe:animate-fade-in motion-safe:animate-duration-500
                backdrop-blur-[2px]`}
              style={{ 
                animationDelay: `${index * 50}ms`
              }}
            >
              {/* Category Tag - Responsive */}
              <div className="flex items-start justify-between mb-3.5 md:mb-2">
                <span className={`inline-flex items-center gap-1.5 
                  px-2.5 py-1 md:px-2 md:py-0.5
                  rounded-full text-sm md:text-xs font-medium
                  bg-white dark:bg-gray-800 md:bg-white/90 md:dark:bg-gray-800/90
                  shadow-sm md:hover:shadow
                  border border-gray-100 dark:border-gray-700/50
                  transition-all duration-200
                  md:hover:-translate-y-0.5
                  ${getCategoryColor(task.category)}
                  backdrop-blur-sm`}
                >
                  <span className="w-3.5 h-3.5 md:w-3 md:h-3">
                    {getCategoryIcon(task.category)}
                  </span>
                  <span className="truncate max-w-[130px] md:max-w-[100px] lg:max-w-[160px]">
                    {task.category.replace(/-/g, ' ')}
                  </span>
                </span>

                {task.isAdminTask && (
                  <Crown className="w-5 h-5 md:w-4 md:h-4 text-amber-500 animate-pulse md:ml-2" />
                )}
              </div>

              {/* Task Content */}
              <div className="space-y-2.5 md:space-y-2">
                <h3 className="text-base md:text-sm lg:text-base font-semibold 
                  text-gray-900 dark:text-gray-100 
                  leading-snug md:leading-tight
                  line-clamp-2"
                >
                  {task.name}
                </h3>

                <p className="text-[15px] md:text-sm 
                  text-gray-600 dark:text-gray-300 
                  leading-relaxed 
                  line-clamp-2"
                >
                  {parseLinks(task.description).map((part, i) => 
                    part.type === 'link' ? (
                      <a
                        key={i}
                        href={part.content}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-sky-600 dark:text-sky-400 
                          active:text-sky-800 md:hover:text-sky-700
                          underline-offset-2 decoration-1
                          px-0.5 -mx-0.5 rounded"
                      >
                        {part.content}
                      </a>
                    ) : (
                      <span key={i}>{part.content}</span>
                    )
                  )}
                </p>
              </div>

              {/* Mobile-optimized footer */}
              <div className="flex items-center justify-between 
                mt-3 pt-3
                border-t border-gray-100 dark:border-gray-700/50"
              >
                <div className="flex items-center gap-3">
                  {/* Mobile-optimized status indicator */}
                  <span className={`inline-flex items-center gap-1.5 
                    text-sm md:text-xs font-medium
                    ${task.status === 'completed'
                      ? 'text-green-600 dark:text-green-400'
                      : overdue
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-sky-600 dark:text-sky-400'}`}
                  >
                    <span className="relative flex h-2.5 w-2.5 md:h-2 md:w-2">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75
                        ${task.status === 'completed'
                          ? 'bg-green-500'
                          : overdue
                            ? 'bg-red-500'
                            : 'bg-sky-500'}`} 
                      />
                      <span className={`relative inline-flex rounded-full h-2.5 w-2.5 md:h-2 md:w-2
                        ${task.status === 'completed'
                          ? 'bg-green-500'
                          : overdue
                            ? 'bg-red-500'
                            : 'bg-sky-500'}`}
                      />
                    </span>
                    {task.status === 'completed' ? 'Complete' : overdue ? 'Overdue' : 'In Progress'}
                  </span>
                </div>

                {/* Mobile-optimized due date */}
                <div className="flex items-center gap-1.5 
                  text-sm md:text-xs text-gray-500 dark:text-gray-400"
                >
                  <Calendar className="w-4 h-4 md:w-3.5 md:h-3.5" />
                  <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Mobile-only touch feedback */}
              <div className="md:hidden absolute inset-0 rounded-2xl pointer-events-none
                bg-gray-900/0 active:bg-gray-900/[0.03] dark:active:bg-gray-900/[0.1]
                transition-colors duration-200" 
              />
            </div>
          );
        })}
      </div>

      {/* Mobile-optimized modal */}
      {selectedTask && (
        <TaskDetailsPopup
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          className={`
            md:max-w-[85vw] lg:max-w-[65vw] xl:max-w-[55vw] 
            md:relative md:rounded-lg md:max-h-[90vh] md:overflow-y-auto
            fixed inset-x-0 bottom-0 w-full h-[90vh]
            rounded-t-2xl overflow-hidden
            bg-white dark:bg-gray-800
            shadow-2xl
            animate-slide-up md:animate-none
            z-50
          `}
        />
      )}
    </div>
  );
}