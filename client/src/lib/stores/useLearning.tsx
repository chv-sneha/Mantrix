import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Course, Level, UserProgress, Badge, AICompanionState, GameResult, LevelStage } from "@shared/types";

interface User {
  id: number;
  username: string;
  email: string | null;
}

interface LearningState {
  user: User | null;
  courses: Course[];
  userProgress: UserProgress;
  aiCompanion: AICompanionState;
  
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, password: string, email?: string) => Promise<void>;
  logout: () => void;
  syncProgress: () => Promise<void>;
  
  setCourses: (courses: Course[]) => void;
  selectCourse: (courseId: string) => void;
  selectLevel: (levelId: string) => void;
  advanceStage: (levelId: string, newStage: LevelStage) => boolean;
  goBackStage: (levelId: string) => boolean;
  startGame: (levelId: string) => boolean;
  completeGame: (levelId: string, result: GameResult) => Promise<void>;
  completeLevel: (levelId: string, xpEarned: number) => Promise<void>;
  addBadge: (badge: Badge) => Promise<void>;
  updateAIMessages: (message: { role: 'user' | 'assistant'; content: string }) => void;
  toggleAICompanion: () => void;
  setCurrentHint: (hint: string | null) => void;
}

const initialCourses: Course[] = [
  {
    id: 'dsa',
    name: 'Data Structures & Algorithms',
    description: 'Master the fundamentals of computer science',
    icon: '🧠',
    color: '#6366f1',
    levels: [
      { 
        id: 'dsa-1', 
        courseId: 'dsa', 
        title: 'Introduction to Programming', 
        description: 'Learn loops, variables, and conditionals', 
        story: 'Welcome to the Valley of Variables! Master loops and conditionals to begin your journey.', 
        xpReward: 100, 
        challengeType: 'interactive', 
        difficulty: 'beginner', 
        unlocked: true, 
        completed: false, 
        currentStage: 'narrative', 
        videoTopic: 'JavaScript loops and variables for beginners',
        aiSuggestedVideos: [
          {
            id: 'dsa1-v1',
            title: 'JavaScript Loops Explained in 10 Minutes',
            channelTitle: 'Programming with Mosh',
            thumbnailUrl: 'https://i.ytimg.com/vi/s9wW2PpJsmQ/maxresdefault.jpg',
            videoUrl: 'https://www.youtube.com/watch?v=s9wW2PpJsmQ'
          },
          {
            id: 'dsa1-v2',
            title: 'For Loops vs While Loops - JavaScript Tutorial',
            channelTitle: 'Web Dev Simplified',
            thumbnailUrl: 'https://i.ytimg.com/vi/PpeDy5wLvJo/maxresdefault.jpg',
            videoUrl: 'https://www.youtube.com/watch?v=PpeDy5wLvJo'
          },
          {
            id: 'dsa1-v3',
            title: 'JavaScript Variables - Let, Const, Var',
            channelTitle: 'Traversy Media',
            thumbnailUrl: 'https://i.ytimg.com/vi/9WIJQDvt4Us/maxresdefault.jpg',
            videoUrl: 'https://www.youtube.com/watch?v=9WIJQDvt4Us'
          }
        ],
        quizQuestions: [
          {
            id: 'dsa-1-q1',
            question: 'What will this code print? for (let i = 1; i <= 5; i++) { console.log(i); }',
            options: ['1 2 3 4 5', '0 1 2 3 4', '1 2 3 4', '0 1 2 3 4 5'],
            correctAnswer: '1 2 3 4 5',
            explanation: 'The loop starts at 1 and runs while i <= 5, printing numbers 1 through 5.',
            type: 'multiple-choice'
          },
          {
            id: 'dsa-1-q2',
            question: 'What keyword do you use to declare a variable that can be reassigned?',
            options: ['const', 'let', 'var', 'Both let and var'],
            correctAnswer: 'Both let and var',
            explanation: 'Both let and var allow reassignment. const creates constants that cannot be reassigned.',
            type: 'multiple-choice'
          }
        ],
        codingProblems: [
          {
            id: 'dsa-1-p1',
            title: 'Sum of Numbers',
            description: 'Write a function that calculates the sum of numbers from 1 to n using a loop.',
            difficulty: 'easy',
            starterCode: 'function sumNumbers(n) {\n  // Write your code here\n  \n}',
            solution: 'function sumNumbers(n) {\n  let sum = 0;\n  for (let i = 1; i <= n; i++) {\n    sum += i;\n  }\n  return sum;\n}',
            functionName: 'sumNumbers',
            testCases: [
              { id: 't1', input: '5', expectedOutput: '15', isHidden: false },
              { id: 't2', input: '10', expectedOutput: '55', isHidden: false },
              { id: 't3', input: '100', expectedOutput: '5050', isHidden: true }
            ],
            hints: [
              'Initialize a sum variable to 0',
              'Use a for loop from 1 to n',
              'Add each number to the sum'
            ],
            tags: ['loops', 'math', 'beginner']
          }
        ],
        externalResources: [
          {
            title: 'Two Sum - LeetCode',
            url: 'https://leetcode.com/problems/two-sum/',
            type: 'leetcode',
            difficulty: 'easy',
            description: 'Classic array problem using loops'
          },
          {
            title: 'JavaScript Loops - MDN',
            url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration',
            type: 'documentation',
            description: 'Complete guide to JavaScript loops'
          },
          {
            title: 'Loops Tutorial - NeetCode',
            url: 'https://neetcode.io/courses/lessons/loops-introduction',
            type: 'neetcode',
            difficulty: 'easy'
          }
        ],
        gameConfig: { id: 'loop-arena-1', type: 'loop-arena', title: 'Loop Arena: Valley of Variables', description: 'Learn loops by collecting items', objective: 'Collect all items using loop patterns', controls: 'WASD or Arrow Keys', passingScore: 90, importanceWhy: 'Loops are the heartbeat of programming - they let you repeat actions efficiently. This game shows you how loops work visually by having you collect items in patterns. Understanding loops is fundamental to solving any problem that requires repetition.' } 
      },
      { 
        id: 'dsa-2', 
        courseId: 'dsa', 
        title: 'Arrays & Lists', 
        description: 'Understanding indexed collections', 
        story: 'Enter the Array Temple where data is stored in ordered sequences.', 
        xpReward: 120, 
        challengeType: 'interactive', 
        difficulty: 'beginner', 
        unlocked: false, 
        completed: false, 
        currentStage: 'narrative',
        videoTopic: 'JavaScript arrays and array methods',
        aiSuggestedVideos: [
          {
            id: 'dsa2-v1',
            title: 'JavaScript Arrays Crash Course',
            channelTitle: 'Traversy Media',
            thumbnailUrl: 'https://i.ytimg.com/vi/7W4pQQ20nJg/maxresdefault.jpg',
            videoUrl: 'https://www.youtube.com/watch?v=7W4pQQ20nJg'
          },
          {
            id: 'dsa2-v2',
            title: '8 Must Know JavaScript Array Methods',
            channelTitle: 'Web Dev Simplified',
            thumbnailUrl: 'https://i.ytimg.com/vi/R8rmfD9Y5-c/maxresdefault.jpg',
            videoUrl: 'https://www.youtube.com/watch?v=R8rmfD9Y5-c'
          }
        ],
        quizQuestions: [
          {
            id: 'dsa-2-q1',
            question: 'How do you access the first element of an array named arr?',
            options: ['arr[0]', 'arr[1]', 'arr.first()', 'arr.get(0)'],
            correctAnswer: 'arr[0]',
            explanation: 'Arrays are zero-indexed, so the first element is at index 0.',
            type: 'multiple-choice'
          }
        ],
        codingProblems: [
          {
            id: 'dsa-2-p1',
            title: 'Find Maximum in Array',
            description: 'Write a function that finds the maximum number in an array.',
            difficulty: 'easy',
            starterCode: 'function findMax(arr) {\n  // Write your code here\n  \n}',
            solution: 'function findMax(arr) {\n  let max = arr[0];\n  for (let i = 1; i < arr.length; i++) {\n    if (arr[i] > max) max = arr[i];\n  }\n  return max;\n}',
            functionName: 'findMax',
            testCases: [
              { id: 't1', input: '[1, 5, 3, 9, 2]', expectedOutput: '9', isHidden: false },
              { id: 't2', input: '[-5, -1, -10]', expectedOutput: '-1', isHidden: false }
            ],
            hints: ['Start with the first element as max', 'Loop through the array', 'Update max if you find a larger value'],
            tags: ['arrays', 'loops', 'beginner']
          }
        ],
        externalResources: [
          {
            title: 'Contains Duplicate - LeetCode',
            url: 'https://leetcode.com/problems/contains-duplicate/',
            type: 'leetcode',
            difficulty: 'easy'
          },
          {
            title: 'Arrays - NeetCode Roadmap',
            url: 'https://neetcode.io/roadmap',
            type: 'neetcode'
          }
        ],
        gameConfig: { id: 'sorting-conveyor-2', type: 'sorting-conveyor', title: 'Array Organizer', description: 'Learn arrays by organizing items', objective: 'Sort items by value', controls: 'Click to swap items', passingScore: 100, importanceWhy: 'Arrays are the most fundamental data structure in programming. This game shows you how to access, manipulate, and organize data in arrays. Every app you use stores and manages lists of data using arrays.' } 
      },
      {
        id: 'dsa-3',
        courseId: 'dsa',
        title: 'Searching Algorithms',
        description: 'Linear and binary search',
        story: 'In the Forest of Search, find treasures using efficient search strategies.',
        narrative: 'The forest holds many treasures, but finding them requires strategy. Learn two fundamental search algorithms: linear search checks every item one by one, while binary search divides and conquers sorted data for lightning-fast lookups.',
        teachingContent: 'Linear Search: O(n) time - checks each element sequentially. Simple but slow for large datasets. Binary Search: O(log n) time - repeatedly divides sorted array in half. Much faster but requires sorted data.',
        xpReward: 130,
        challengeType: 'interactive',
        difficulty: 'beginner',
        unlocked: false,
        completed: false,
        currentStage: 'narrative',
        videoTopic: 'Binary search algorithm explained with examples',
        quizQuestions: [
          {
            id: 'dsa-3-q1',
            question: 'What is the time complexity of binary search?',
            options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
            correctAnswer: 'O(log n)',
            explanation: 'Binary search divides the search space in half each time, giving logarithmic time complexity.',
            type: 'multiple-choice'
          },
          {
            id: 'dsa-3-q2',
            question: 'What condition must be met to use binary search?',
            options: ['Array must be sorted', 'Array must be unsorted', 'Array must have duplicates', 'Array must be empty'],
            correctAnswer: 'Array must be sorted',
            explanation: 'Binary search only works on sorted arrays because it relies on comparing the middle element to determine which half to search.',
            type: 'multiple-choice'
          }
        ],
        codingProblems: [
          {
            id: 'dsa-3-p1',
            title: 'Binary Search Implementation',
            description: 'Write a function that performs binary search on a sorted array. Return the index of the target value, or -1 if not found.',
            difficulty: 'medium',
            starterCode: 'function binarySearch(arr, target) {\n  // Write your code here\n  \n}',
            solution: 'function binarySearch(arr, target) {\n  let left = 0;\n  let right = arr.length - 1;\n  \n  while (left <= right) {\n    let mid = Math.floor((left + right) / 2);\n    \n    if (arr[mid] === target) return mid;\n    if (arr[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  \n  return -1;\n}',
            functionName: 'binarySearch',
            testCases: [
              { id: 't1', input: '[[1, 3, 5, 7, 9], 5]', expectedOutput: '2', isHidden: false },
              { id: 't2', input: '[[1, 3, 5, 7, 9], 6]', expectedOutput: '-1', isHidden: false },
              { id: 't3', input: '[[10, 20, 30, 40, 50], 10]', expectedOutput: '0', isHidden: true }
            ],
            hints: [
              'Use two pointers: left and right',
              'Find the middle index: Math.floor((left + right) / 2)',
              'Compare middle element with target to decide which half to search'
            ],
            tags: ['searching', 'binary-search', 'algorithms']
          }
        ],
        externalResources: [
          {
            title: 'Binary Search - LeetCode',
            url: 'https://leetcode.com/problems/binary-search/',
            type: 'leetcode',
            difficulty: 'easy',
            description: 'Classic binary search problem'
          },
          {
            title: 'Search Insert Position - LeetCode',
            url: 'https://leetcode.com/problems/search-insert-position/',
            type: 'leetcode',
            difficulty: 'easy',
            description: 'Binary search variation'
          },
          {
            title: 'Binary Search - NeetCode',
            url: 'https://neetcode.io/problems/binary-search',
            type: 'neetcode',
            difficulty: 'easy'
          }
        ],
        gameConfig: {
          id: 'search-challenge-3',
          type: 'search-challenge',
          title: 'Treasure Hunt',
          description: 'Find hidden items using search algorithms',
          objective: 'Locate all treasures efficiently',
          controls: 'Click to search, use hints wisely',
          passingScore: 85,
          importanceWhy: 'Search algorithms are essential for finding data efficiently. This game demonstrates the dramatic difference between linear and binary search - understanding when to use each can make your programs run 1000x faster on large datasets.'
        }
      },
      {
        id: 'dsa-4',
        courseId: 'dsa',
        title: 'Linked Lists',
        description: 'Understanding node-based data structures',
        story: 'Navigate the Chain Bridge where each node points to the next.',
        narrative: 'In the realm of data structures, linked lists offer dynamic memory allocation where elements (nodes) connect via pointers. Unlike arrays, linked lists excel at insertions and deletions.',
        teachingContent: 'A linked list consists of nodes, each containing data and a reference (pointer) to the next node. Types include singly linked lists, doubly linked lists, and circular linked lists.',
        xpReward: 140,
        challengeType: 'interactive',
        difficulty: 'beginner',
        unlocked: false,
        completed: false,
        currentStage: 'narrative',
        videoTopic: 'Linked lists data structure explained with examples',
        quizQuestions: [
          {
            id: 'dsa-4-q1',
            question: 'What is the time complexity of inserting a node at the beginning of a linked list?',
            options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
            correctAnswer: 'O(1)',
            explanation: 'Inserting at the beginning only requires updating the head pointer and the new node\'s next pointer, taking constant time.',
            type: 'multiple-choice'
          },
          {
            id: 'dsa-4-q2',
            question: 'What advantage do linked lists have over arrays?',
            options: ['Random access', 'Dynamic size', 'Less memory usage', 'Faster search'],
            correctAnswer: 'Dynamic size',
            explanation: 'Linked lists can grow and shrink dynamically without pre-allocating memory like arrays.',
            type: 'multiple-choice'
          }
        ],
        codingProblems: [
          {
            id: 'dsa-4-p1',
            title: 'Reverse Linked List',
            description: 'Reverse a singly linked list and return the new head.',
            difficulty: 'medium',
            starterCode: 'function reverseList(head) {\n  // head is the first node with properties: val and next\n  // Write your code here\n  \n}',
            solution: 'function reverseList(head) {\n  let prev = null;\n  let current = head;\n  while (current) {\n    let next = current.next;\n    current.next = prev;\n    prev = current;\n    current = next;\n  }\n  return prev;\n}',
            functionName: 'reverseList',
            testCases: [
              { id: 't1', input: '[{"val":1,"next":{"val":2,"next":{"val":3,"next":null}}}]', expectedOutput: '{"val":3,"next":{"val":2,"next":{"val":1,"next":null}}}', isHidden: false },
              { id: 't2', input: '[null]', expectedOutput: 'null', isHidden: false }
            ],
            hints: ['Use three pointers: prev, current, and next', 'Iterate through the list reversing pointers', 'Return prev at the end'],
            tags: ['linked-list', 'pointers']
          }
        ],
        externalResources: [
          {
            title: 'Reverse Linked List - LeetCode',
            url: 'https://leetcode.com/problems/reverse-linked-list/',
            type: 'leetcode',
            difficulty: 'easy'
          },
          {
            title: 'Linked List Cycle - LeetCode',
            url: 'https://leetcode.com/problems/linked-list-cycle/',
            type: 'leetcode',
            difficulty: 'easy'
          },
          {
            title: 'Linked Lists - NeetCode',
            url: 'https://neetcode.io/roadmap',
            type: 'neetcode'
          }
        ],
        gameConfig: {
          id: 'pattern-builder-4',
          type: 'pattern-builder',
          title: 'Chain Bridge Navigator',
          description: 'Build and traverse linked list chains',
          objective: 'Connect nodes correctly to form a path',
          controls: 'Click to connect nodes',
          passingScore: 85,
          importanceWhy: 'Linked lists are fundamental to understanding pointers and dynamic data structures. They\'re used in many applications like browser history, music playlists, and implementing other data structures like stacks and queues.'
        }
      },
      {
        id: 'dsa-5',
        courseId: 'dsa',
        title: 'Stacks',
        description: 'Last-In-First-Out (LIFO) operations',
        story: 'Climb the Tower of Stacks where the last item added is first removed.',
        narrative: 'Stacks are fundamental data structures following LIFO principle. Perfect for undo operations, expression evaluation, and backtracking algorithms.',
        teachingContent: 'A stack supports push (add to top), pop (remove from top), and peek (view top) operations. Think of a stack of plates - you can only add or remove from the top.',
        xpReward: 150,
        challengeType: 'interactive',
        difficulty: 'beginner',
        unlocked: false,
        completed: false,
        currentStage: 'narrative',
        videoTopic: 'Stack data structure and applications tutorial',
        quizQuestions: [
          {
            id: 'dsa-5-q1',
            question: 'Which operation is NOT supported by a standard stack?',
            options: ['push', 'pop', 'peek', 'random access'],
            correctAnswer: 'random access',
            explanation: 'Stacks only allow access to the top element, not random access to middle elements.',
            type: 'multiple-choice'
          }
        ],
        codingProblems: [
          {
            id: 'dsa-5-p1',
            title: 'Valid Parentheses',
            description: 'Given a string containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid. An input string is valid if brackets close in the correct order.',
            difficulty: 'easy',
            starterCode: 'function isValid(s) {\n  // Write your code here\n  \n}',
            solution: 'function isValid(s) {\n  const stack = [];\n  const pairs = {\"(\": \")\", \"{\": \"}\", \"[\": \"]\"};\n  for (let char of s) {\n    if (pairs[char]) stack.push(char);\n    else if (stack.length === 0 || pairs[stack.pop()] !== char) return false;\n  }\n  return stack.length === 0;\n}',
            functionName: 'isValid',
            testCases: [
              { id: 't1', input: '"()"', expectedOutput: 'true', isHidden: false },
              { id: 't2', input: '"()[]{}"', expectedOutput: 'true', isHidden: false },
              { id: 't3', input: '"(]"', expectedOutput: 'false', isHidden: false }
            ],
            hints: ['Use a stack to keep track of opening brackets', 'When you see a closing bracket, check if it matches the top of the stack'],
            tags: ['stack', 'string']
          }
        ],
        externalResources: [
          {
            title: 'Valid Parentheses - LeetCode',
            url: 'https://leetcode.com/problems/valid-parentheses/',
            type: 'leetcode',
            difficulty: 'easy'
          },
          {
            title: 'Stacks - NeetCode',
            url: 'https://neetcode.io/roadmap',
            type: 'neetcode'
          }
        ],
        gameConfig: {
          id: 'pattern-builder-5',
          type: 'pattern-builder',
          title: 'Stack Tower',
          description: 'Build towers using stack operations',
          objective: 'Manage items using LIFO principle',
          controls: 'Click to push/pop',
          passingScore: 85
        }
      },
      {
        id: 'dsa-6',
        courseId: 'dsa',
        title: 'Queues',
        description: 'First-In-First-Out (FIFO) operations',
        story: 'Join the Queue Kingdom where fairness rules - first come, first served!',
        narrative: 'Queues follow the FIFO principle - first element added is first removed. Essential for BFS, scheduling, and real-world queue simulations.',
        teachingContent: 'A queue supports enqueue (add to rear), dequeue (remove from front), and peek (view front) operations. Like a line at a store.',
        xpReward: 150,
        challengeType: 'interactive',
        difficulty: 'beginner',
        unlocked: false,
        completed: false,
        currentStage: 'narrative',
        videoTopic: 'Queue data structure implementation and use cases',
        quizQuestions: [
          {
            id: 'dsa-6-q1',
            question: 'In a queue, where are new elements added?',
            options: ['Front', 'Rear', 'Middle', 'Random position'],
            correctAnswer: 'Rear',
            explanation: 'In a queue, elements are added at the rear and removed from the front (FIFO).',
            type: 'multiple-choice'
          }
        ],
        codingProblems: [
          {
            id: 'dsa-6-p1',
            title: 'Implement Queue using Stacks',
            description: 'Implement a queue using two stacks.',
            difficulty: 'easy',
            starterCode: 'class MyQueue {\n  constructor() {\n    this.stack1 = [];\n    this.stack2 = [];\n  }\n  \n  enqueue(x) {\n    // Write your code here\n  }\n  \n  dequeue() {\n    // Write your code here\n  }\n}',
            solution: 'class MyQueue {\n  constructor() {\n    this.stack1 = [];\n    this.stack2 = [];\n  }\n  enqueue(x) {\n    this.stack1.push(x);\n  }\n  dequeue() {\n    if (this.stack2.length === 0) {\n      while (this.stack1.length > 0) {\n        this.stack2.push(this.stack1.pop());\n      }\n    }\n    return this.stack2.pop();\n  }\n}',
            functionName: 'MyQueue',
            testCases: [
              { id: 't1', input: '["enqueue",1,"enqueue",2,"dequeue"]', expectedOutput: '1', isHidden: false }
            ],
            hints: ['Use one stack for enqueue, another for dequeue', 'Transfer elements when dequeue stack is empty'],
            tags: ['queue', 'stack']
          }
        ],
        externalResources: [
          {
            title: 'Implement Queue using Stacks - LeetCode',
            url: 'https://leetcode.com/problems/implement-queue-using-stacks/',
            type: 'leetcode',
            difficulty: 'easy'
          },
          {
            title: 'Queues - NeetCode',
            url: 'https://neetcode.io/roadmap',
            type: 'neetcode'
          }
        ],
        gameConfig: {
          id: 'sorting-conveyor-6',
          type: 'sorting-conveyor',
          title: 'Queue Kingdom',
          description: 'Process items in FIFO order',
          objective: 'Manage queue operations correctly',
          controls: 'Click to enqueue/dequeue',
          passingScore: 85
        }
      },
      {
        id: 'dsa-7',
        courseId: 'dsa',
        title: 'Hash Tables',
        description: 'Key-value pairs and hashing',
        story: 'Unlock the Hash Vault where keys open instant access to treasures.',
        narrative: 'Hash tables provide O(1) average-case lookup, insert, and delete operations using key-value pairs and hash functions.',
        teachingContent: 'Hash tables use a hash function to compute an index into an array of buckets. Collision resolution techniques include chaining and open addressing.',
        xpReward: 160,
        challengeType: 'interactive',
        difficulty: 'intermediate',
        unlocked: false,
        completed: false,
        currentStage: 'narrative',
        videoTopic: 'Hash tables and hash maps explained',
        quizQuestions: [
          {
            id: 'dsa-7-q1',
            question: 'What is the average time complexity of hash table lookup?',
            options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
            correctAnswer: 'O(1)',
            explanation: 'Hash tables provide constant-time average-case lookup using hash functions.',
            type: 'multiple-choice'
          }
        ],
        codingProblems: [
          {
            id: 'dsa-7-p1',
            title: 'Two Sum',
            description: 'Given an array of integers and a target, return indices of two numbers that add up to target.',
            difficulty: 'easy',
            starterCode: 'function twoSum(nums, target) {\n  // Write your code here\n  \n}',
            solution: 'function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}',
            functionName: 'twoSum',
            testCases: [
              { id: 't1', input: '[[2,7,11,15], 9]', expectedOutput: '[0,1]', isHidden: false },
              { id: 't2', input: '[[3,2,4], 6]', expectedOutput: '[1,2]', isHidden: false }
            ],
            hints: ['Use a hash map to store seen numbers and their indices', 'For each number, check if target - number exists in the map'],
            tags: ['hash-table', 'array']
          }
        ],
        externalResources: [
          {
            title: 'Two Sum - LeetCode',
            url: 'https://leetcode.com/problems/two-sum/',
            type: 'leetcode',
            difficulty: 'easy'
          },
          {
            title: 'Hash Tables - NeetCode',
            url: 'https://neetcode.io/roadmap',
            type: 'neetcode'
          }
        ],
        gameConfig: {
          id: 'search-challenge-7',
          type: 'search-challenge',
          title: 'Hash Vault',
          description: 'Use hashing to find treasures instantly',
          objective: 'Implement hash-based lookups',
          controls: 'Click to hash and search',
          passingScore: 85
        }
      },
      {
        id: 'dsa-8',
        courseId: 'dsa',
        title: 'Binary Trees',
        description: 'Hierarchical tree structures',
        story: 'Explore the Binary Forest where each node has at most two children.',
        narrative: 'Trees are hierarchical data structures with a root node and child nodes. Binary trees limit each node to at most two children.',
        teachingContent: 'Binary trees have applications in file systems, databases, and expression parsing. Each node contains data and pointers to left and right children.',
        xpReward: 170,
        challengeType: 'interactive',
        difficulty: 'intermediate',
        unlocked: false,
        completed: false,
        currentStage: 'narrative',
        videoTopic: 'Binary trees structure and basic operations',
        quizQuestions: [{id: 'dsa-8-q1', question: 'What is the maximum number of children a node can have in a binary tree?', options: ['1', '2', '3', 'Unlimited'], correctAnswer: '2', explanation: 'Binary trees by definition have at most two children per node.', type: 'multiple-choice'}],
        codingProblems: [{id: 'dsa-8-p1', title: 'Tree Height', description: 'Calculate the height of a binary tree.', difficulty: 'easy', starterCode: 'function maxDepth(root) {\n  // Write your code here\n  \n}', solution: 'function maxDepth(root) {\n  if (!root) return 0;\n  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));\n}', functionName: 'maxDepth', testCases: [{id: 't1', input: '[null]', expectedOutput: '0'}], hints: ['Use recursion', 'Base case: null node has height 0'], tags: ['tree', 'recursion']}],
        externalResources: [{title: 'Maximum Depth of Binary Tree - LeetCode', url: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/', type: 'leetcode', difficulty: 'easy'}, {title: 'Binary Trees - NeetCode', url: 'https://neetcode.io/roadmap', type: 'neetcode'}],
        gameConfig: {id: 'recursion-maze-8', type: 'recursion-maze', title: 'Binary Forest Explorer', description: 'Navigate through binary tree structures', objective: 'Traverse the tree correctly', controls: 'Arrow Keys', passingScore: 85}
      },
      {
        id: 'dsa-9',
        courseId: 'dsa',
        title: 'Binary Search Trees',
        description: 'Ordered binary trees for fast lookup',
        story: 'Master the BST Cathedral where left is less, right is more.',
        narrative: 'BSTs maintain order: left subtree < root < right subtree. This enables O(log n) search, insert, and delete.',
        teachingContent: 'BST property: all left descendants < node < all right descendants. Balanced BSTs guarantee logarithmic operations.',
        xpReward: 180,
        challengeType: 'interactive',
        difficulty: 'intermediate',
        unlocked: false,
        completed: false,
        currentStage: 'narrative',
        videoTopic: 'Binary search trees and BST operations',
        quizQuestions: [{id: 'dsa-9-q1', question: 'In a BST, where are smaller values located relative to a node?', options: ['Left subtree', 'Right subtree', 'Parent', 'Either side'], correctAnswer: 'Left subtree', explanation: 'BST property requires smaller values in left subtree.', type: 'multiple-choice'}],
        codingProblems: [{id: 'dsa-9-p1', title: 'Validate BST', description: 'Determine if a binary tree is a valid BST.', difficulty: 'medium', starterCode: 'function isValidBST(root) {\n  // Write your code here\n  \n}', solution: 'function isValidBST(root, min = -Infinity, max = Infinity) {\n  if (!root) return true;\n  if (root.val <= min || root.val >= max) return false;\n  return isValidBST(root.left, min, root.val) && isValidBST(root.right, root.val, max);\n}', functionName: 'isValidBST', testCases: [{id: 't1', input: '[null]', expectedOutput: 'true'}], hints: ['Check BST property recursively', 'Pass min/max constraints down'], tags: ['bst', 'tree']}],
        externalResources: [{title: 'Validate BST - LeetCode', url: 'https://leetcode.com/problems/validate-binary-search-tree/', type: 'leetcode', difficulty: 'medium'}, {title: 'BST Problems - NeetCode', url: 'https://neetcode.io/roadmap', type: 'neetcode'}],
        gameConfig: {id: 'search-challenge-9', type: 'search-challenge', title: 'BST Cathedral', description: 'Navigate ordered binary search trees', objective: 'Find values using BST property', controls: 'Click to search', passingScore: 85, importanceWhy: 'BSTs combine the benefits of arrays and linked lists. This game shows how the BST property (left < root < right) enables O(log n) searches, making databases and file systems incredibly fast.'}
      },
      {
        id: 'dsa-10',
        courseId: 'dsa',
        title: 'Tree Traversals',
        description: 'Inorder, preorder, postorder, and level-order',
        story: 'Navigate the Traversal Maze using different paths through the trees.',
        narrative: 'Different traversal orders visit nodes in specific sequences: inorder (left-root-right), preorder (root-left-right), postorder (left-right-root), level-order (breadth-first).',
        teachingContent: 'Inorder gives sorted sequence for BST. Preorder good for copying trees. Postorder useful for deletion. Level-order uses queue.',
        xpReward: 190,
        challengeType: 'interactive',
        difficulty: 'intermediate',
        unlocked: false,
        completed: false,
        currentStage: 'narrative',
        videoTopic: 'Tree traversal algorithms: inorder, preorder, postorder, level-order',
        quizQuestions: [{id: 'dsa-10-q1', question: 'Which traversal visits nodes in sorted order for a BST?', options: ['Inorder', 'Preorder', 'Postorder', 'Level-order'], correctAnswer: 'Inorder', explanation: 'Inorder traversal (left-root-right) produces sorted sequence for BST.', type: 'multiple-choice'}],
        codingProblems: [{id: 'dsa-10-p1', title: 'Inorder Traversal', description: 'Return inorder traversal of a binary tree.', difficulty: 'easy', starterCode: 'function inorderTraversal(root) {\n  // Return array of values\n  \n}', solution: 'function inorderTraversal(root) {\n  if (!root) return [];\n  return [...inorderTraversal(root.left), root.val, ...inorderTraversal(root.right)];\n}', functionName: 'inorderTraversal', testCases: [{id: 't1', input: '[null]', expectedOutput: '[]'}], hints: ['Recursively traverse left, visit root, traverse right'], tags: ['tree', 'traversal']}],
        externalResources: [{title: 'Binary Tree Inorder Traversal - LeetCode', url: 'https://leetcode.com/problems/binary-tree-inorder-traversal/', type: 'leetcode', difficulty: 'easy'}, {title: 'Tree Traversals - NeetCode', url: 'https://neetcode.io/roadmap', type: 'neetcode'}],
        gameConfig: {id: 'recursion-maze-10', type: 'recursion-maze', title: 'Traversal Maze', description: 'Navigate using tree traversal patterns', objective: 'Reach all checkpoints in order', controls: 'Arrow Keys', passingScore: 90, importanceWhy: 'Tree traversals are fundamental to working with hierarchical data. This game demonstrates different traversal orders - each one is perfect for specific tasks like copying trees, deleting nodes, or processing data in sorted order.'}
      },
      {id: 'dsa-11', courseId: 'dsa', title: 'Heaps & Priority Queues', description: 'Min-heap and max-heap structures', story: 'Scale the Heap Mountain where priority determines position.', narrative: 'Heaps are specialized trees where parent is always greater/less than children. Priority queues use heaps for O(log n) insert/extract.', teachingContent: 'Min-heap: parent < children. Max-heap: parent > children. Used in Dijkstra\'s algorithm, heap sort, scheduling systems.', xpReward: 200, challengeType: 'interactive', difficulty: 'intermediate', unlocked: false, completed: false, currentStage: 'narrative', videoTopic: 'Heaps and priority queues explained', quizQuestions: [{id: 'dsa-11-q1', question: 'What is the time complexity of heap insert?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], correctAnswer: 'O(log n)', explanation: 'Heap insert requires bubbling up, which is O(log n).', type: 'multiple-choice'}], codingProblems: [{id: 'dsa-11-p1', title: 'Kth Largest Element', description: 'Find the kth largest element using a heap.', difficulty: 'medium', starterCode: 'function findKthLargest(nums, k) {\n  // Write your code here\n  \n}', solution: 'function findKthLargest(nums, k) {\n  nums.sort((a,b) => b-a);\n  return nums[k-1];\n}', functionName: 'findKthLargest', testCases: [{id: 't1', input: '[[3,2,1,5,6,4], 2]', expectedOutput: '5'}], hints: ['Sort array descending', 'Return element at index k-1'], tags: ['heap']}], externalResources: [{title: 'Kth Largest Element - LeetCode', url: 'https://leetcode.com/problems/kth-largest-element-in-an-array/', type: 'leetcode', difficulty: 'medium'}, {title: 'Heaps - NeetCode', url: 'https://neetcode.io/roadmap', type: 'neetcode'}], gameConfig: {id: 'pattern-builder-11', type: 'pattern-builder', title: 'Heap Mountain', description: 'Build and maintain heap structures', objective: 'Keep heap property intact', controls: 'Click to insert/extract', passingScore: 85, importanceWhy: 'Heaps power priority queues used everywhere - task schedulers, event systems, Dijkstra\'s shortest path algorithm. This game shows how heaps maintain priority order efficiently.'}},
      {id: 'dsa-12', courseId: 'dsa', title: 'Graphs - Basics', description: 'Vertices, edges, and representations', story: 'Map the Graph Galaxy where everything connects to everything.', narrative: 'Graphs model connections: social networks, maps, dependencies. Vertices (nodes) connect via edges.', teachingContent: 'Adjacency list vs matrix. Directed vs undirected. Weighted vs unweighted graphs.', xpReward: 210, challengeType: 'interactive', difficulty: 'intermediate', unlocked: false, completed: false, currentStage: 'narrative', videoTopic: 'Graph data structures and representations', quizQuestions: [{id: 'dsa-12-q1', question: 'Which graph representation is more space-efficient for sparse graphs?', options: ['Adjacency Matrix', 'Adjacency List', 'Both equal', 'Neither'], correctAnswer: 'Adjacency List', explanation: 'Adjacency list only stores existing edges, saving space in sparse graphs.', type: 'multiple-choice'}], codingProblems: [{id: 'dsa-12-p1', title: 'Build Adjacency List', description: 'Convert edge list to adjacency list representation.', difficulty: 'easy', starterCode: 'function buildGraph(edges) {\n  // Return adjacency list\n  \n}', solution: 'function buildGraph(edges) {\n  const graph = {};\n  for (let [u,v] of edges) {\n    if (!graph[u]) graph[u] = [];\n    if (!graph[v]) graph[v] = [];\n    graph[u].push(v);\n    graph[v].push(u);\n  }\n  return graph;\n}', functionName: 'buildGraph', testCases: [{id: 't1', input: '[[[1,2],[1,3]]]', expectedOutput: '{"1":[2,3],"2":[1],"3":[1]}'}], hints: ['Initialize empty object for graph', 'For each edge, add connections both ways'], tags: ['graph']}], externalResources: [{title: 'Graph Theory - LeetCode', url: 'https://leetcode.com/tag/graph/', type: 'leetcode'}, {title: 'Graphs - NeetCode', url: 'https://neetcode.io/roadmap', type: 'neetcode'}], gameConfig: {id: 'search-challenge-12', type: 'search-challenge', title: 'Graph Galaxy', description: 'Connect vertices and explore graphs', objective: 'Build graph structures', controls: 'Click to connect nodes', passingScore: 85, importanceWhy: 'Graphs model real-world networks - social media, GPS systems, recommendation engines. This game shows how to represent and navigate connections, a skill used in countless applications.'}},
      {id: 'dsa-13', courseId: 'dsa', title: 'Graph Traversals (DFS/BFS)', description: 'Depth-first and breadth-first search', story: 'Explore the Network Nexus using systematic traversal strategies.', narrative: 'DFS explores deep before backtracking. BFS explores level by level. Essential for pathfinding and connectivity.', teachingContent: 'DFS uses stack/recursion. BFS uses queue. DFS for topological sort, BFS for shortest path in unweighted graphs.', xpReward: 220, challengeType: 'interactive', difficulty: 'advanced', unlocked: false, completed: false, currentStage: 'narrative', videoTopic: 'Graph traversal: DFS and BFS algorithms', quizQuestions: [{id: 'dsa-13-q1', question: 'Which data structure does BFS use?', options: ['Stack', 'Queue', 'Heap', 'Tree'], correctAnswer: 'Queue', explanation: 'BFS uses a queue to process nodes level by level.', type: 'multiple-choice'}], codingProblems: [{id: 'dsa-13-p1', title: 'Number of Islands', description: 'Count islands using DFS/BFS in a 2D grid.', difficulty: 'medium', starterCode: 'function numIslands(grid) {\n  // Write your code here\n  \n}', solution: 'function numIslands(grid) {\n  let count = 0;\n  for (let i = 0; i < grid.length; i++) {\n    for (let j = 0; j < grid[0].length; j++) {\n      if (grid[i][j] === "1") {\n        count++;\n        dfs(grid, i, j);\n      }\n    }\n  }\n  return count;\n}\nfunction dfs(grid, i, j) {\n  if (i < 0 || i >= grid.length || j < 0 || j >= grid[0].length || grid[i][j] === "0") return;\n  grid[i][j] = "0";\n  dfs(grid, i+1, j);\n  dfs(grid, i-1, j);\n  dfs(grid, i, j+1);\n  dfs(grid, i, j-1);\n}', functionName: 'numIslands', testCases: [{id: 't1', input: '[[["1","1"],["1","0"]]]', expectedOutput: '1'}], hints: ['Use DFS to mark connected land', 'Count how many times you start a new DFS'], tags: ['graph', 'dfs']}], externalResources: [{title: 'Number of Islands - LeetCode', url: 'https://leetcode.com/problems/number-of-islands/', type: 'leetcode', difficulty: 'medium'}, {title: 'Graph Traversal - NeetCode', url: 'https://neetcode.io/roadmap', type: 'neetcode'}], gameConfig: {id: 'recursion-maze-13', type: 'recursion-maze', title: 'Network Nexus', description: 'Traverse graphs using DFS and BFS', objective: 'Visit all nodes systematically', controls: 'Arrow Keys', passingScore: 85, importanceWhy: 'Graph traversals power everything from Google searches to finding the shortest route in GPS. This game teaches you how DFS and BFS systematically explore networks.'}},
      {id: 'dsa-14', courseId: 'dsa', title: 'Sorting - Bubble & Selection', description: 'Simple comparison-based sorting', story: 'Start at the Sorting Academy with fundamental techniques.', narrative: 'Bubble sort repeatedly swaps adjacent elements. Selection sort finds minimum and places it. Both O(n²) but educational.', teachingContent: 'Bubble: compare adjacent, swap if wrong order. Selection: find min, swap with first unsorted.', xpReward: 230, challengeType: 'interactive', difficulty: 'intermediate', unlocked: false, completed: false, currentStage: 'narrative', videoTopic: 'Bubble sort and selection sort algorithms', quizQuestions: [{id: 'dsa-14-q1', question: 'What is the time complexity of bubble sort?', options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(2^n)'], correctAnswer: 'O(n²)', explanation: 'Bubble sort has nested loops, resulting in O(n²) time complexity.', type: 'multiple-choice'}], codingProblems: [{id: 'dsa-14-p1', title: 'Implement Bubble Sort', description: 'Sort an array using bubble sort algorithm.', difficulty: 'easy', starterCode: 'function bubbleSort(arr) {\n  // Write your code here\n  \n}', solution: 'function bubbleSort(arr) {\n  for (let i = 0; i < arr.length; i++) {\n    for (let j = 0; j < arr.length - i - 1; j++) {\n      if (arr[j] > arr[j+1]) {\n        [arr[j], arr[j+1]] = [arr[j+1], arr[j]];\n      }\n    }\n  }\n  return arr;\n}', functionName: 'bubbleSort', testCases: [{id: 't1', input: '[[5,2,8,1]]', expectedOutput: '[1,2,5,8]'}], hints: ['Use nested loops', 'Swap adjacent elements if out of order'], tags: ['sorting']}], externalResources: [{title: 'Sort an Array - LeetCode', url: 'https://leetcode.com/problems/sort-an-array/', type: 'leetcode', difficulty: 'medium'}, {title: 'Sorting - NeetCode', url: 'https://neetcode.io/roadmap', type: 'neetcode'}], gameConfig: {id: 'sorting-conveyor-14', type: 'sorting-conveyor', title: 'Sorting Academy', description: 'Sort items using basic algorithms', objective: 'Arrange items in order', controls: 'Click to swap', passingScore: 85, importanceWhy: 'Sorting is fundamental to computer science. This game shows basic sorting algorithms that teach you how to think about organizing data step-by-step.'}},
      {id: 'dsa-15', courseId: 'dsa', title: 'Sorting - Merge & Quick', description: 'Divide-and-conquer sorting algorithms', story: 'Master advanced sorting in the Algorithm Arena.', narrative: 'Merge sort divides, sorts, merges. Quick sort picks pivot, partitions. Both O(n log n) average case.', teachingContent: 'Merge sort: stable, predictable O(n log n). Quick sort: in-place, faster average but O(n²) worst case.', xpReward: 240, challengeType: 'interactive', difficulty: 'advanced', unlocked: false, completed: false, currentStage: 'narrative', videoTopic: 'Merge sort and quick sort algorithms explained', quizQuestions: [{id: 'dsa-15-q1', question: 'Which sorting algorithm is stable?', options: ['Quick Sort', 'Merge Sort', 'Heap Sort', 'Selection Sort'], correctAnswer: 'Merge Sort', explanation: 'Merge sort maintains relative order of equal elements (stable).', type: 'multiple-choice'}], codingProblems: [{id: 'dsa-15-p1', title: 'Implement Merge Sort', description: 'Sort an array using merge sort.', difficulty: 'medium', starterCode: 'function mergeSort(arr) {\n  // Write your code here\n  \n}', solution: 'function mergeSort(arr) {\n  if (arr.length <= 1) return arr;\n  const mid = Math.floor(arr.length / 2);\n  const left = mergeSort(arr.slice(0, mid));\n  const right = mergeSort(arr.slice(mid));\n  return merge(left, right);\n}\nfunction merge(left, right) {\n  const result = [];\n  let i = 0, j = 0;\n  while (i < left.length && j < right.length) {\n    if (left[i] < right[j]) result.push(left[i++]);\n    else result.push(right[j++]);\n  }\n  return result.concat(left.slice(i)).concat(right.slice(j));\n}', functionName: 'mergeSort', testCases: [{id: 't1', input: '[[5,2,8,1,9]]', expectedOutput: '[1,2,5,8,9]'}], hints: ['Divide array in half recursively', 'Merge sorted halves'], tags: ['sorting', 'recursion']}], externalResources: [{title: 'Sort an Array - LeetCode', url: 'https://leetcode.com/problems/sort-an-array/', type: 'leetcode', difficulty: 'medium'}, {title: 'Sorting Algorithms - NeetCode', url: 'https://neetcode.io/roadmap', type: 'neetcode'}], gameConfig: {id: 'sorting-conveyor-15', type: 'sorting-conveyor', title: 'Algorithm Arena', description: 'Master advanced sorting techniques', objective: 'Efficiently sort large datasets', controls: 'Click to partition/merge', passingScore: 85, importanceWhy: 'Efficient sorting algorithms like merge sort and quick sort are used in every programming language\'s built-in sort. Understanding divide-and-conquer techniques is crucial for advanced programming.'}},
      {id: 'dsa-16', courseId: 'dsa', title: 'Recursion', description: 'Functions calling themselves', story: 'Descend into the Recursive Abyss where functions call themselves infinitely.', narrative: 'Recursion solves problems by breaking them into smaller subproblems. Base case prevents infinite recursion.', teachingContent: 'Every recursive function needs: base case (when to stop) and recursive case (how to make progress).', xpReward: 250, challengeType: 'interactive', difficulty: 'advanced', unlocked: false, completed: false, currentStage: 'narrative', videoTopic: 'Recursion fundamentals and problem-solving', quizQuestions: [{id: 'dsa-16-q1', question: 'What prevents infinite recursion?', options: ['Base case', 'Recursive case', 'Return statement', 'Loop'], correctAnswer: 'Base case', explanation: 'Base case stops recursion by providing a direct answer.', type: 'multiple-choice'}], codingProblems: [{id: 'dsa-16-p1', title: 'Fibonacci Number', description: 'Calculate nth Fibonacci number using recursion.', difficulty: 'easy', starterCode: 'function fib(n) {\n  // Write your code here\n  \n}', solution: 'function fib(n) {\n  if (n <= 1) return n;\n  return fib(n-1) + fib(n-2);\n}', functionName: 'fib', testCases: [{id: 't1', input: '5', expectedOutput: '5'}, {id: 't2', input: '10', expectedOutput: '55'}], hints: ['Base case: fib(0)=0, fib(1)=1', 'Recursive case: fib(n) = fib(n-1) + fib(n-2)'], tags: ['recursion']}], externalResources: [{title: 'Fibonacci Number - LeetCode', url: 'https://leetcode.com/problems/fibonacci-number/', type: 'leetcode', difficulty: 'easy'}, {title: 'Recursion - NeetCode', url: 'https://neetcode.io/roadmap', type: 'neetcode'}], gameConfig: {id: 'recursion-maze-16', type: 'recursion-maze', title: 'Recursive Abyss', description: 'Navigate using recursive thinking', objective: 'Solve problems recursively', controls: 'Arrow Keys', passingScore: 85, importanceWhy: 'Recursion is a powerful problem-solving technique that breaks complex problems into simpler ones. This game visualizes how recursive calls work together to solve problems elegantly.'}},
      {id: 'dsa-17', courseId: 'dsa', title: 'Backtracking', description: 'Exploring all possibilities', story: 'Navigate the Backtracking Labyrinth by trying all paths.', narrative: 'Backtracking tries all solutions, abandoning invalid paths early. Used for puzzles, permutations, combinations.', teachingContent: 'Build solution incrementally. If invalid, backtrack (undo last choice) and try next option.', xpReward: 260, challengeType: 'interactive', difficulty: 'advanced', unlocked: false, completed: false, currentStage: 'narrative', videoTopic: 'Backtracking algorithm and applications', quizQuestions: [{id: 'dsa-17-q1', question: 'When does backtracking abandon a path?', options: ['When solution is found', 'When path becomes invalid', 'After fixed iterations', 'Never'], correctAnswer: 'When path becomes invalid', explanation: 'Backtracking abandons paths that cannot lead to valid solutions.', type: 'multiple-choice'}], codingProblems: [{id: 'dsa-17-p1', title: 'Generate Permutations', description: 'Generate all permutations of an array.', difficulty: 'medium', starterCode: 'function permute(nums) {\n  // Return all permutations\n  \n}', solution: 'function permute(nums) {\n  const result = [];\n  function backtrack(curr) {\n    if (curr.length === nums.length) {\n      result.push([...curr]);\n      return;\n    }\n    for (let num of nums) {\n      if (!curr.includes(num)) {\n        curr.push(num);\n        backtrack(curr);\n        curr.pop();\n      }\n    }\n  }\n  backtrack([]);\n  return result;\n}', functionName: 'permute', testCases: [{id: 't1', input: '[[1,2]]', expectedOutput: '[[1,2],[2,1]]'}], hints: ['Try each number', 'Backtrack by removing last choice'], tags: ['backtracking']}], externalResources: [{title: 'Permutations - LeetCode', url: 'https://leetcode.com/problems/permutations/', type: 'leetcode', difficulty: 'medium'}, {title: 'Backtracking - NeetCode', url: 'https://neetcode.io/roadmap', type: 'neetcode'}], gameConfig: {id: 'backtracking-puzzle-17', type: 'backtracking-puzzle', title: 'Backtracking Labyrinth', description: 'Find paths through trial and error', objective: 'Explore all possibilities', controls: 'Arrow Keys', passingScore: 85}},
      {id: 'dsa-18', courseId: 'dsa', title: 'Dynamic Programming - Basics', description: 'Optimization using memoization', story: 'Unlock the DP Dimension where remembering saves time.', narrative: 'DP solves optimization problems by storing subproblem solutions. Avoid redundant calculations.', teachingContent: 'Two approaches: top-down (memoization) and bottom-up (tabulation). Identify overlapping subproblems and optimal substructure.', xpReward: 270, challengeType: 'interactive', difficulty: 'advanced', unlocked: false, completed: false, currentStage: 'narrative', videoTopic: 'Dynamic programming introduction and memoization', quizQuestions: [{id: 'dsa-18-q1', question: 'What does memoization store?', options: ['Function calls', 'Subproblem results', 'Loop iterations', 'Variable names'], correctAnswer: 'Subproblem results', explanation: 'Memoization caches results of expensive function calls.', type: 'multiple-choice'}], codingProblems: [{id: 'dsa-18-p1', title: 'Climbing Stairs', description: 'Count ways to climb n stairs (1 or 2 steps at a time).', difficulty: 'easy', starterCode: 'function climbStairs(n) {\n  // Write your code here\n  \n}', solution: 'function climbStairs(n) {\n  if (n <= 2) return n;\n  const dp = [0, 1, 2];\n  for (let i = 3; i <= n; i++) {\n    dp[i] = dp[i-1] + dp[i-2];\n  }\n  return dp[n];\n}', functionName: 'climbStairs', testCases: [{id: 't1', input: '3', expectedOutput: '3'}, {id: 't2', input: '5', expectedOutput: '8'}], hints: ['Similar to Fibonacci', 'dp[n] = dp[n-1] + dp[n-2]'], tags: ['dp']}], externalResources: [{title: 'Climbing Stairs - LeetCode', url: 'https://leetcode.com/problems/climbing-stairs/', type: 'leetcode', difficulty: 'easy'}, {title: 'Dynamic Programming - NeetCode', url: 'https://neetcode.io/roadmap', type: 'neetcode'}], gameConfig: {id: 'pattern-builder-18', type: 'pattern-builder', title: 'DP Dimension', description: 'Optimize using memoization', objective: 'Solve problems efficiently with DP', controls: 'Click to compute', passingScore: 85}},
      {id: 'dsa-19', courseId: 'dsa', title: 'Greedy Algorithms', description: 'Making locally optimal choices', story: 'Join the Greedy Guild where best now means best overall.', narrative: 'Greedy algorithms make locally optimal choices hoping for global optimum. Works when local optimal leads to global optimal.', teachingContent: 'Greedy choice property: local optimum leads to global optimum. Used in Huffman coding, Dijkstra\'s, interval scheduling.', xpReward: 280, challengeType: 'interactive', difficulty: 'advanced', unlocked: false, completed: false, currentStage: 'narrative', videoTopic: 'Greedy algorithms and optimization strategies', quizQuestions: [{id: 'dsa-19-q1', question: 'What does greedy algorithm do at each step?', options: ['Explores all options', 'Makes locally optimal choice', 'Uses memoization', 'Backtracks'], correctAnswer: 'Makes locally optimal choice', explanation: 'Greedy algorithms choose best immediate option without reconsidering.', type: 'multiple-choice'}], codingProblems: [{id: 'dsa-19-p1', title: 'Jump Game', description: 'Can you reach the last index by jumping?', difficulty: 'medium', starterCode: 'function canJump(nums) {\n  // Write your code here\n  \n}', solution: 'function canJump(nums) {\n  let maxReach = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (i > maxReach) return false;\n    maxReach = Math.max(maxReach, i + nums[i]);\n  }\n  return true;\n}', functionName: 'canJump', testCases: [{id: 't1', input: '[[2,3,1,1,4]]', expectedOutput: 'true'}, {id: 't2', input: '[[3,2,1,0,4]]', expectedOutput: 'false'}], hints: ['Track maximum reachable index', 'Update as you iterate'], tags: ['greedy']}], externalResources: [{title: 'Jump Game - LeetCode', url: 'https://leetcode.com/problems/jump-game/', type: 'leetcode', difficulty: 'medium'}, {title: 'Greedy - NeetCode', url: 'https://neetcode.io/roadmap', type: 'neetcode'}], gameConfig: {id: 'search-challenge-19', type: 'search-challenge', title: 'Greedy Guild', description: 'Make optimal local choices', objective: 'Optimize using greedy strategy', controls: 'Click to choose', passingScore: 85}},
      {id: 'dsa-20', courseId: 'dsa', title: 'Advanced Topics', description: 'Tries, segment trees, and beyond', story: 'Reach the Masters Summit with the most complex structures.', narrative: 'Advanced data structures for specialized problems: tries for strings, segment trees for range queries, union-find for connectivity.', teachingContent: 'Trie: prefix tree for string operations. Segment tree: efficient range queries. Union-find: track connected components.', xpReward: 300, challengeType: 'interactive', difficulty: 'expert', unlocked: false, completed: false, currentStage: 'narrative', videoTopic: 'Advanced data structures: tries, segment trees, union-find', quizQuestions: [{id: 'dsa-20-q1', question: 'What is a trie optimized for?', options: ['Numeric operations', 'String prefix operations', 'Graph traversal', 'Sorting'], correctAnswer: 'String prefix operations', explanation: 'Tries excel at prefix matching and autocomplete features.', type: 'multiple-choice'}], codingProblems: [{id: 'dsa-20-p1', title: 'Implement Trie', description: 'Implement a trie with insert, search, and startsWith.', difficulty: 'medium', starterCode: 'class Trie {\n  constructor() {\n    // Initialize\n  }\n  insert(word) {}\n  search(word) {}\n  startsWith(prefix) {}\n}', solution: 'class Trie {\n  constructor() {\n    this.root = {};\n  }\n  insert(word) {\n    let node = this.root;\n    for (let char of word) {\n      if (!node[char]) node[char] = {};\n      node = node[char];\n    }\n    node.isEnd = true;\n  }\n  search(word) {\n    let node = this.root;\n    for (let char of word) {\n      if (!node[char]) return false;\n      node = node[char];\n    }\n    return !!node.isEnd;\n  }\n  startsWith(prefix) {\n    let node = this.root;\n    for (let char of prefix) {\n      if (!node[char]) return false;\n      node = node[char];\n    }\n    return true;\n  }\n}', functionName: 'Trie', testCases: [{id: 't1', input: '["insert","apple","search","apple"]', expectedOutput: 'true'}], hints: ['Use nested objects to represent trie', 'Mark end of words with a flag'], tags: ['trie', 'string']}], externalResources: [{title: 'Implement Trie - LeetCode', url: 'https://leetcode.com/problems/implement-trie-prefix-tree/', type: 'leetcode', difficulty: 'medium'}, {title: 'Advanced Topics - NeetCode', url: 'https://neetcode.io/roadmap', type: 'neetcode'}], gameConfig: {id: 'pattern-builder-20', type: 'pattern-builder', title: 'Masters Summit', description: 'Master advanced data structures', objective: 'Solve complex problems', controls: 'Click to build structures', passingScore: 90}},
    ]
  },
  {
    id: 'webdev',
    name: 'Web Development',
    description: 'Build the Matrix - Your AI Gamified Full Stack Journey',
    icon: '🌐',
    color: '#8b5cf6',
    levels: [
      {
        id: 'web-1',
        courseId: 'webdev',
        title: 'Enter the Matrix (HTML Basics)',
        description: 'Build the world using HTML blocks',
        story: 'You awaken in the Matrix — the world is blank; you must build it.',
        narrative: 'The Matrix world needs structure. Every website begins with HTML - the skeleton that holds everything together. You will learn to create headings, paragraphs, links, images, lists, tables, and semantic tags that give meaning to your content.',
        teachingContent: 'HTML (HyperText Markup Language) is the foundation of all web pages. Think of it as the blueprint of a building - it defines what goes where. Tags like <h1>, <p>, <img>, and <a> are your building blocks.',
        xpReward: 150,
        challengeType: 'interactive',
        difficulty: 'beginner',
        unlocked: true,
        completed: false,
        currentStage: 'narrative',
        quizPassScore: 70,
        gameConfig: {
          id: 'markup-forge-1',
          type: 'markup-forge',
          title: 'The Builder\'s Origin',
          description: 'Construct the digital city using HTML blocks',
          objective: 'Build structures by placing correct HTML elements',
          controls: 'Click to place elements, WASD to move',
          passingScore: 80,
          importanceWhy: 'This game teaches you how HTML elements work together to create structure. Just like building blocks, each HTML tag has a specific purpose. Understanding this foundation is crucial because every website you\'ll ever build starts with HTML structure.'
        },
        videoTopic: 'HTML basics and semantic HTML tutorial',
        aiSuggestedVideos: [
          {
            id: 'web1-v1',
            title: 'HTML Crash Course For Absolute Beginners',
            channelTitle: 'Traversy Media',
            thumbnailUrl: 'https://i.ytimg.com/vi/UB1O30fR-EE/maxresdefault.jpg',
            videoUrl: 'https://www.youtube.com/watch?v=UB1O30fR-EE'
          },
          {
            id: 'web1-v2',
            title: 'Learn HTML5 and CSS3 From Scratch',
            channelTitle: 'Programming with Mosh',
            thumbnailUrl: 'https://i.ytimg.com/vi/qz0aGYrrlhU/maxresdefault.jpg',
            videoUrl: 'https://www.youtube.com/watch?v=qz0aGYrrlhU'
          },
          {
            id: 'web1-v3',
            title: 'Semantic HTML - Why It Matters',
            channelTitle: 'Kevin Powell',
            thumbnailUrl: 'https://i.ytimg.com/vi/kGW8Al_cga4/maxresdefault.jpg',
            videoUrl: 'https://www.youtube.com/watch?v=kGW8Al_cga4'
          }
        ],
        quizQuestions: [
          {
            id: 'web-1-q1',
            question: 'What does HTML stand for?',
            options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlinks and Text Markup Language'],
            correctAnswer: 'Hyper Text Markup Language',
            explanation: 'HTML stands for HyperText Markup Language, the standard markup language for web pages.',
            type: 'multiple-choice'
          },
          {
            id: 'web-1-q2',
            question: 'Which tag is used to create a hyperlink?',
            options: ['<link>', '<a>', '<href>', '<url>'],
            correctAnswer: '<a>',
            explanation: 'The <a> (anchor) tag is used to create hyperlinks in HTML.',
            type: 'multiple-choice'
          },
          {
            id: 'web-1-q3',
            question: 'What is the purpose of semantic HTML?',
            options: ['To make pages load faster', 'To give meaning to the structure', 'To add colors and styles', 'To make code shorter'],
            correctAnswer: 'To give meaning to the structure',
            explanation: 'Semantic HTML uses tags like <header>, <nav>, <article> to give meaning to content structure, improving accessibility and SEO.',
            type: 'multiple-choice'
          }
        ],
        codingProblems: [
          {
            id: 'web-1-p1',
            title: 'Create a Profile Card',
            description: 'Write HTML code to create a simple profile card with a heading (h1), paragraph (p), and image (img).',
            difficulty: 'easy',
            starterCode: 'function createProfile(name, bio, imageUrl) {\n  // Return HTML string\n  \n}',
            solution: 'function createProfile(name, bio, imageUrl) {\n  return `<div>\n    <h1>${name}</h1>\n    <img src="${imageUrl}" alt="${name}">\n    <p>${bio}</p>\n  </div>`;\n}',
            functionName: 'createProfile',
            testCases: [
              { id: 't1', input: '["John Doe", "Web Developer", "photo.jpg"]', expectedOutput: '"<div>\\n    <h1>John Doe</h1>\\n    <img src=\\"photo.jpg\\" alt=\\"John Doe\\">\\n    <p>Web Developer</p>\\n  </div>"', isHidden: false },
              { id: 't2', input: '["Jane", "Designer", "avatar.png"]', expectedOutput: '"<div>\\n    <h1>Jane</h1>\\n    <img src=\\"avatar.png\\" alt=\\"Jane\\">\\n    <p>Designer</p>\\n  </div>"', isHidden: false }
            ],
            hints: [
              'Use template literals to build the HTML string',
              'Include h1 for name, img for image, and p for bio',
              'Remember to use proper HTML structure with opening and closing tags'
            ],
            tags: ['html', 'basics', 'web-development']
          }
        ],
        externalResources: [
          {
            title: 'Two Sum - LeetCode',
            url: 'https://leetcode.com/problems/two-sum/',
            type: 'leetcode',
            difficulty: 'easy',
            description: 'Classic array problem - great for beginners'
          },
          {
            title: 'Valid Parentheses - LeetCode',
            url: 'https://leetcode.com/problems/valid-parentheses/',
            type: 'leetcode',
            difficulty: 'easy',
            description: 'Stack-based string validation problem'
          },
          {
            title: 'Palindrome Number - LeetCode',
            url: 'https://leetcode.com/problems/palindrome-number/',
            type: 'leetcode',
            difficulty: 'easy',
            description: 'Number manipulation and logic'
          },
          {
            title: 'Roman to Integer - LeetCode',
            url: 'https://leetcode.com/problems/roman-to-integer/',
            type: 'leetcode',
            difficulty: 'easy',
            description: 'String processing and mapping'
          },
          {
            title: 'Longest Common Prefix - LeetCode',
            url: 'https://leetcode.com/problems/longest-common-prefix/',
            type: 'leetcode',
            difficulty: 'easy',
            description: 'String comparison and iteration'
          }
        ]
      },
      {
        id: 'web-2',
        courseId: 'webdev',
        title: 'The Stylist\'s Realm (CSS)',
        description: 'Color the Matrix with CSS styling',
        story: 'You\'ve built the structure, now bring color and beauty to the Matrix.',
        narrative: 'The Matrix city exists but it\'s gray and lifeless. CSS (Cascading Style Sheets) is your tool to paint this world - colors, layouts, animations, and responsive designs that adapt to any screen.',
        teachingContent: 'CSS controls how HTML elements look. Selectors target elements, properties define styles. The box model (margin, padding, border) controls spacing. Flexbox and Grid create layouts. Animations bring life to static pages.',
        xpReward: 180,
        challengeType: 'interactive',
        difficulty: 'beginner',
        unlocked: true,
        completed: false,
        currentStage: 'narrative',
        quizPassScore: 75,
        videoTopic: 'CSS fundamentals: selectors, box model, flexbox, and grid',
        aiSuggestedVideos: [
          {
            id: 'web2-v1',
            title: 'CSS Crash Course For Absolute Beginners',
            channelTitle: 'Traversy Media',
            thumbnailUrl: 'https://i.ytimg.com/vi/yfoY53QXEnI/maxresdefault.jpg',
            videoUrl: 'https://www.youtube.com/watch?v=yfoY53QXEnI'
          },
          {
            id: 'web2-v2',
            title: 'Learn CSS Flexbox in 20 Minutes',
            channelTitle: 'Web Dev Simplified',
            thumbnailUrl: 'https://i.ytimg.com/vi/FTlczfR82mQ/maxresdefault.jpg',
            videoUrl: 'https://www.youtube.com/watch?v=FTlczfR82mQ'
          },
          {
            id: 'web2-v3',
            title: 'CSS Grid Layout Crash Course',
            channelTitle: 'Traversy Media',
            thumbnailUrl: 'https://i.ytimg.com/vi/jV8B24rSN5o/maxresdefault.jpg',
            videoUrl: 'https://www.youtube.com/watch?v=jV8B24rSN5o'
          }
        ],
        quizQuestions: [
          {
            id: 'web-2-q1',
            question: 'What does CSS stand for?',
            options: ['Cascading Style Sheets', 'Creative Style System', 'Computer Style Syntax', 'Colorful Style Sheets'],
            correctAnswer: 'Cascading Style Sheets',
            explanation: 'CSS stands for Cascading Style Sheets, used to style HTML elements.',
            type: 'multiple-choice'
          },
          {
            id: 'web-2-q2',
            question: 'Which CSS property controls the space between an element\'s content and its border?',
            options: ['margin', 'padding', 'border', 'spacing'],
            correctAnswer: 'padding',
            explanation: 'Padding creates space between content and border. Margin is outside the border.',
            type: 'multiple-choice'
          }
        ],
        codingProblems: [
          {
            id: 'web-2-p1',
            title: 'Generate CSS Styles',
            description: 'Write a function that generates CSS styling for a card component with background color, padding, and border radius.',
            difficulty: 'easy',
            starterCode: 'function generateCardCSS(bgColor, padding, borderRadius) {\n  // Return CSS string\n  \n}',
            solution: 'function generateCardCSS(bgColor, padding, borderRadius) {\n  return `.card {\n  background-color: ${bgColor};\n  padding: ${padding}px;\n  border-radius: ${borderRadius}px;\n}`;\n}',
            functionName: 'generateCardCSS',
            testCases: [
              { id: 't1', input: '["#fff", 20, 8]', expectedOutput: '".card {\\n  background-color: #fff;\\n  padding: 20px;\\n  border-radius: 8px;\\n}"', isHidden: false }
            ],
            hints: ['Use template literals to build the CSS string', 'Include property names and values with proper syntax'],
            tags: ['css', 'styling']
          }
        ],
        externalResources: [
          {
            title: 'Best Time to Buy and Sell Stock - LeetCode',
            url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/',
            type: 'leetcode',
            difficulty: 'easy',
            description: 'Array manipulation and profit calculation'
          },
          {
            title: 'Maximum Subarray - LeetCode',
            url: 'https://leetcode.com/problems/maximum-subarray/',
            type: 'leetcode',
            difficulty: 'medium',
            description: 'Dynamic programming classic problem'
          },
          {
            title: 'Merge Two Sorted Lists - LeetCode',
            url: 'https://leetcode.com/problems/merge-two-sorted-lists/',
            type: 'leetcode',
            difficulty: 'easy',
            description: 'Linked list merging algorithm'
          },
          {
            title: 'Valid Anagram - LeetCode',
            url: 'https://leetcode.com/problems/valid-anagram/',
            type: 'leetcode',
            difficulty: 'easy',
            description: 'String manipulation and sorting'
          }
        ],
        gameConfig: {
          id: 'style-spectrum-2',
          type: 'style-spectrum',
          title: 'Design the City',
          description: 'Transform the grayscale city with CSS styling',
          objective: 'Apply correct styles to restore color and layout',
          controls: 'Select elements and apply CSS properties',
          passingScore: 85,
          importanceWhy: 'Styling is what separates amateur websites from professional ones. This game shows you how CSS properties work together - colors, layouts, spacing, and responsive design. Mastering CSS means you can bring any design vision to life.'
        }
      },
      {
        id: 'web-3',
        courseId: 'webdev',
        title: 'The Logic Chamber (JavaScript)',
        description: 'Give life to the Matrix with JavaScript logic',
        story: 'The city is beautiful but static. JavaScript brings intelligence and interactivity.',
        narrative: 'Now the Matrix needs a brain. JavaScript makes websites interactive - responding to clicks, processing data, updating content dynamically. You\'ll learn variables, functions, loops, events, and how to manipulate the DOM.',
        teachingContent: 'JavaScript is the programming language of the web. Variables store data, functions perform actions, loops repeat tasks, and events respond to user interactions. The DOM (Document Object Model) lets you change HTML and CSS on the fly.',
        xpReward: 220,
        challengeType: 'interactive',
        difficulty: 'intermediate',
        unlocked: true,
        completed: false,
        currentStage: 'narrative',
        quizPassScore: 75,
        videoTopic: 'JavaScript fundamentals: variables, functions, DOM manipulation',
        quizQuestions: [
          {
            id: 'web-3-q1',
            question: 'What does DOM stand for?',
            options: ['Document Object Model', 'Data Object Management', 'Digital Output Module', 'Document Oriented Markup'],
            correctAnswer: 'Document Object Model',
            explanation: 'DOM represents the HTML document as a tree structure that JavaScript can manipulate.',
            type: 'multiple-choice'
          },
          {
            id: 'web-3-q2',
            question: 'Which method adds an event listener to an HTML element?',
            options: ['addEventListener', 'attachEvent', 'onClick', 'bindEvent'],
            correctAnswer: 'addEventListener',
            explanation: 'addEventListener is the standard method to attach event handlers to elements.',
            type: 'multiple-choice'
          }
        ],
        codingProblems: [
          {
            id: 'web-3-p1',
            title: 'Toggle Class',
            description: 'Write a function that toggles a CSS class on an element (returns new class list as string).',
            difficulty: 'easy',
            starterCode: 'function toggleClass(currentClasses, toggleClass) {\n  // currentClasses is string like "btn active"\n  // Return new classes after toggle\n  \n}',
            solution: 'function toggleClass(currentClasses, toggleClass) {\n  const classes = currentClasses.split(" ").filter(c => c);\n  const index = classes.indexOf(toggleClass);\n  if (index > -1) classes.splice(index, 1);\n  else classes.push(toggleClass);\n  return classes.join(" ");\n}',
            functionName: 'toggleClass',
            testCases: [
              { id: 't1', input: '["btn", "active"]', expectedOutput: '"btn active"', isHidden: false },
              { id: 't2', input: '["btn active", "active"]', expectedOutput: '"btn"', isHidden: false }
            ],
            hints: ['Split the class string into an array', 'Check if the class exists, add or remove accordingly'],
            tags: ['javascript', 'dom']
          }
        ],
        externalResources: [
          {
            title: 'JavaScript Guide - MDN',
            url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide',
            type: 'documentation',
            description: 'Comprehensive JavaScript guide'
          },
          {
            title: 'JavaScript30 - Free Course',
            url: 'https://javascript30.com/',
            type: 'article',
            description: '30 Day Vanilla JS Coding Challenge'
          }
        ],
        gameConfig: {
          id: 'script-circuit-3',
          type: 'script-circuit',
          title: 'The Code Core',
          description: 'Fix broken bots using JavaScript commands',
          objective: 'Write JavaScript logic to activate circuit nodes',
          controls: 'Type code, click to execute',
          passingScore: 80,
          importanceWhy: 'JavaScript is where web development becomes powerful. This game demonstrates core programming concepts - variables, functions, loops - in a visual way. Every interactive feature you\'ve ever used on a website uses JavaScript.'
        }
      },
      {
        id: 'web-4',
        courseId: 'webdev',
        title: 'The Portal of Components (React.js)',
        description: 'Master component-based architecture',
        story: 'You can now manipulate the Matrix using reusable components.',
        narrative: 'Building complex interfaces one element at a time is inefficient. React teaches you to think in components - reusable, composable pieces that manage their own state and can be combined to build sophisticated applications.',
        teachingContent: 'React is a JavaScript library for building user interfaces. Components are like custom HTML tags you create. Props pass data down, State manages data within. Hooks like useState and useEffect add functionality. React makes complex UIs manageable.',
        xpReward: 280,
        challengeType: 'interactive',
        difficulty: 'intermediate',
        unlocked: true,
        completed: false,
        currentStage: 'narrative',
        quizPassScore: 80,
        videoTopic: 'React fundamentals: components, props, state, and hooks',
        quizQuestions: [
          {
            id: 'web-4-q1',
            question: 'What is the correct way to pass data to a child component in React?',
            options: ['Props', 'State', 'Context', 'Refs'],
            correctAnswer: 'Props',
            explanation: 'Props (properties) are used to pass data from parent to child components.',
            type: 'multiple-choice'
          },
          {
            id: 'web-4-q2',
            question: 'Which hook is used to manage component state in React?',
            options: ['useState', 'useEffect', 'useContext', 'useRef'],
            correctAnswer: 'useState',
            explanation: 'useState hook allows functional components to have state.',
            type: 'multiple-choice'
          }
        ],
        codingProblems: [
          {
            id: 'web-4-p1',
            title: 'Create React Component String',
            description: 'Write a function that generates a simple React component string with given name and props.',
            difficulty: 'medium',
            starterCode: 'function createComponent(name, propsObj) {\n  // Return JSX-like string\n  \n}',
            solution: 'function createComponent(name, propsObj) {\n  const props = Object.entries(propsObj).map(([k,v]) => `${k}="${v}"`).join(" ");\n  return `<${name} ${props} />`;\n}',
            functionName: 'createComponent',
            testCases: [
              { id: 't1', input: '["Button", {"color": "blue", "size": "large"}]', expectedOutput: '"<Button color=\\"blue\\" size=\\"large\\" />"', isHidden: false }
            ],
            hints: ['Convert props object to key="value" format', 'Combine into JSX-like syntax'],
            tags: ['react', 'jsx']
          }
        ],
        externalResources: [
          {
            title: 'React Documentation',
            url: 'https://react.dev/',
            type: 'documentation',
            description: 'Official React documentation'
          },
          {
            title: 'React Tutorial - Scrimba',
            url: 'https://scrimba.com/learn/learnreact',
            type: 'article',
            description: 'Interactive React course'
          }
        ],
        gameConfig: {
          id: 'component-link-4',
          type: 'component-link',
          title: 'Build the Resistance Network',
          description: 'Create a dashboard by connecting React components',
          objective: 'Link components with correct props and state',
          controls: 'Drag to connect, click to configure',
          passingScore: 85,
          importanceWhy: 'React revolutionized web development by introducing component thinking. This game shows how components communicate through props, manage internal state, and compose into complex interfaces. Understanding this pattern is essential for modern web development.'
        }
      },
      {
        id: 'web-5',
        courseId: 'webdev',
        title: 'The Underworld of Servers (Node.js + Express)',
        description: 'Build the backend infrastructure',
        story: 'The Matrix backend is corrupted — rebuild it with server logic.',
        narrative: 'Every website needs a server - something that stores data, processes requests, and sends responses. Node.js lets you write server code in JavaScript. Express makes it easy to create APIs that your frontend can talk to.',
        teachingContent: 'Node.js runs JavaScript outside the browser. Express is a framework for building web servers. REST APIs use HTTP methods (GET, POST, PUT, DELETE) to perform operations. Routing directs requests, middleware processes them, and responses send data back.',
        xpReward: 320,
        challengeType: 'interactive',
        difficulty: 'advanced',
        unlocked: true,
        completed: false,
        currentStage: 'narrative',
        quizPassScore: 80,
        videoTopic: 'Node.js and Express: building REST APIs and server-side logic',
        quizQuestions: [
          {
            id: 'web-5-q1',
            question: 'What HTTP method is used to retrieve data from a server?',
            options: ['GET', 'POST', 'PUT', 'DELETE'],
            correctAnswer: 'GET',
            explanation: 'GET requests retrieve data without modifying it on the server.',
            type: 'multiple-choice'
          },
          {
            id: 'web-5-q2',
            question: 'What is middleware in Express.js?',
            options: ['Functions that process requests before reaching route handlers', 'Database connectors', 'Template engines', 'Error handlers only'],
            correctAnswer: 'Functions that process requests before reaching route handlers',
            explanation: 'Middleware functions have access to request, response, and can modify them or end the request-response cycle.',
            type: 'multiple-choice'
          }
        ],
        codingProblems: [
          {
            id: 'web-5-p1',
            title: 'Create API Route',
            description: 'Write a function that returns an API route definition object with method, path, and handler.',
            difficulty: 'medium',
            starterCode: 'function createRoute(method, path, data) {\n  // Return route object\n  \n}',
            solution: 'function createRoute(method, path, data) {\n  return { method, path, handler: () => data };\n}',
            functionName: 'createRoute',
            testCases: [
              { id: 't1', input: '["GET", "/api/users", {"users": []}]', expectedOutput: '{"method":"GET","path":"/api/users"}', isHidden: false }
            ],
            hints: ['Return an object with method, path, and handler properties', 'Handler should be a function returning data'],
            tags: ['nodejs', 'express', 'api']
          }
        ],
        externalResources: [
          {
            title: 'Express.js Guide',
            url: 'https://expressjs.com/en/guide/routing.html',
            type: 'documentation',
            description: 'Official Express routing guide'
          },
          {
            title: 'Node.js Best Practices',
            url: 'https://github.com/goldbergyoni/nodebestpractices',
            type: 'article',
            description: 'Comprehensive Node.js best practices'
          }
        ],
        gameConfig: {
          id: 'service-runner-5',
          type: 'service-runner',
          title: 'Server Reboot Protocol',
          description: 'Repair server nodes through API routing puzzles',
          objective: 'Connect routes to correct handlers and middleware',
          controls: 'Click to route requests, configure endpoints',
          passingScore: 85,
          importanceWhy: 'Backend development is where data lives. This game visualizes how HTTP requests flow through routes and middleware to endpoints. Understanding the server-side is crucial - without it, your frontend has nowhere to save or fetch data.'
        }
      },
      {
        id: 'web-6',
        courseId: 'webdev',
        title: 'The Memory Grid (Database)',
        description: 'Restore the world\'s data and memory',
        story: 'Data fragments are lost — restore the Matrix\'s memory with database operations.',
        narrative: 'Your application needs to remember things - user accounts, posts, settings. Databases store this information permanently. You\'ll learn about SQL vs NoSQL, creating schemas, relationships between data, and performing CRUD operations.',
        teachingContent: 'Databases persist data beyond page refreshes. SQL databases (PostgreSQL, MySQL) use structured tables with relationships. NoSQL databases (MongoDB) use flexible documents. Schemas define data structure. CRUD means Create, Read, Update, Delete - the four basic operations.',
        xpReward: 350,
        challengeType: 'interactive',
        difficulty: 'advanced',
        unlocked: true,
        completed: false,
        currentStage: 'narrative',
        quizPassScore: 80,
        videoTopic: 'SQL databases, schemas, and CRUD operations tutorial',
        quizQuestions: [
          {
            id: 'web-6-q1',
            question: 'What does CRUD stand for in database operations?',
            options: ['Create, Read, Update, Delete', 'Connect, Retrieve, Upload, Download', 'Copy, Run, Update, Delete', 'Create, Remove, Upload, Deploy'],
            correctAnswer: 'Create, Read, Update, Delete',
            explanation: 'CRUD represents the four basic operations for persistent storage.',
            type: 'multiple-choice'
          },
          {
            id: 'web-6-q2',
            question: 'What SQL command is used to retrieve data?',
            options: ['SELECT', 'GET', 'FETCH', 'RETRIEVE'],
            correctAnswer: 'SELECT',
            explanation: 'SELECT is the SQL command to query and retrieve data from database tables.',
            type: 'multiple-choice'
          }
        ],
        codingProblems: [
          {
            id: 'web-6-p1',
            title: 'Build SQL Query',
            description: 'Write a function that generates a SQL SELECT query for a given table and columns.',
            difficulty: 'easy',
            starterCode: 'function buildQuery(table, columns) {\n  // Return SQL query string\n  \n}',
            solution: 'function buildQuery(table, columns) {\n  return `SELECT ${columns.join(", ")} FROM ${table};`;\n}',
            functionName: 'buildQuery',
            testCases: [
              { id: 't1', input: '["users", ["id", "name", "email"]]', expectedOutput: '"SELECT id, name, email FROM users;"', isHidden: false }
            ],
            hints: ['Use SELECT keyword followed by column names', 'End with FROM table_name'],
            tags: ['sql', 'database']
          }
        ],
        externalResources: [
          {
            title: 'SQL Tutorial - W3Schools',
            url: 'https://www.w3schools.com/sql/',
            type: 'documentation',
            description: 'Interactive SQL tutorial'
          },
          {
            title: 'PostgreSQL Documentation',
            url: 'https://www.postgresql.org/docs/',
            type: 'documentation',
            description: 'Official PostgreSQL docs'
          }
        ],
        gameConfig: {
          id: 'data-bridge-6',
          type: 'data-bridge',
          title: 'Data Reconstruction',
          description: 'Collect and connect data shards into meaningful relationships',
          objective: 'Build database schema and establish relationships',
          controls: 'Drag tables, connect relationships',
          passingScore: 85,
          importanceWhy: 'Databases are the foundation of data-driven applications. This game shows how data relates - users have posts, posts have comments. Understanding relationships and schema design determines how well your application scales and performs.'
        }
      },
      {
        id: 'web-7',
        courseId: 'webdev',
        title: 'The Final Layer (Deployment & Integration)',
        description: 'Release your creation to the real world',
        story: 'It\'s time to release the Matrix to the world beyond.',
        narrative: 'You\'ve built a complete application - frontend, backend, and database. Now you need to deploy it so anyone can access it. Learn about environment variables, version control with Git, CI/CD pipelines, and deployment platforms.',
        teachingContent: 'Deployment means making your app accessible on the internet. Git tracks code changes. Environment variables store secrets securely. CI/CD automates testing and deployment. Platforms like Render, Vercel, and Replit host your application. HTTPS encrypts connections.',
        xpReward: 400,
        challengeType: 'interactive',
        difficulty: 'advanced',
        unlocked: true,
        completed: false,
        currentStage: 'narrative',
        quizPassScore: 85,
        gameConfig: {
          id: 'deploy-orbit-7',
          type: 'deploy-orbit',
          title: 'The Great Launch',
          description: 'Deploy your project and launch it to production',
          objective: 'Configure deployment pipeline and fix environment issues',
          controls: 'Click to configure, solve deployment puzzles',
          passingScore: 90,
          importanceWhy: 'Building something amazing means nothing if no one can use it. This game simulates real deployment challenges - environment variables, build errors, DNS configuration. Mastering deployment means you can ship your ideas to real users.'
        }
      }
    ]
  },
  {
    id: 'aiml',
    name: 'MATRIX: The AI/ML Quest',
    description: 'Awaken your inner algorithm. Train your mind like you train a model.',
    icon: '🤖',
    color: '#ec4899',
    levels: [
      {
        id: 'aiml-1',
        courseId: 'aiml',
        title: 'The Awakening',
        description: 'Intro to AI & ML Concepts',
        story: 'You wake up in the "Neural Nexus" — a world powered by intelligent entities. To understand this world, you must first learn what powers it — Artificial Intelligence.',
        narrative: 'Welcome to the Neural Nexus! This world runs on Artificial Intelligence - systems that can learn, reason, and make decisions. You\'ll discover what AI is, how machines learn from data, and see real examples of AI in action all around you.',
        teachingContent: 'AI (Artificial Intelligence) enables machines to perform tasks that typically require human intelligence - like recognizing faces, understanding language, or playing games. Machine Learning is a subset of AI where systems learn from data without explicit programming. Deep Learning uses neural networks with many layers. Examples: Netflix recommendations (supervised learning), self-driving cars, chatbots like me!',
        xpReward: 150,
        challengeType: 'interactive',
        difficulty: 'beginner',
        unlocked: true,
        completed: false,
        currentStage: 'narrative',
        videoTopic: 'Introduction to AI and Machine Learning explained',
        aiSuggestedVideos: [
          {
            id: 'aiml1-v1',
            title: 'AI vs Machine Learning vs Deep Learning',
            channelTitle: 'IBM Technology',
            thumbnailUrl: 'https://i.ytimg.com/vi/4RixMPF4xis/maxresdefault.jpg',
            videoUrl: 'https://www.youtube.com/watch?v=4RixMPF4xis'
          },
          {
            id: 'aiml1-v2',
            title: 'Machine Learning Explained in 5 Minutes',
            channelTitle: 'AI Explained',
            thumbnailUrl: 'https://i.ytimg.com/vi/ukzFI9rgwfU/maxresdefault.jpg',
            videoUrl: 'https://www.youtube.com/watch?v=ukzFI9rgwfU'
          }
        ],
        quizQuestions: [
          {
            id: 'aiml-1-q1',
            question: 'What is the main difference between AI and Machine Learning?',
            options: ['AI is older than ML', 'ML is a subset of AI focused on learning from data', 'They are exactly the same', 'ML requires more computing power'],
            correctAnswer: 'ML is a subset of AI focused on learning from data',
            explanation: 'Machine Learning is a specific approach within AI where systems learn patterns from data rather than being explicitly programmed with rules.',
            type: 'multiple-choice'
          },
          {
            id: 'aiml-1-q2',
            question: 'Which of these is an example of supervised learning?',
            options: ['Clustering customer data', 'Netflix movie recommendations', 'Exploring unknown data patterns', 'Generating random art'],
            correctAnswer: 'Netflix movie recommendations',
            explanation: 'Netflix uses supervised learning - it learns from labeled data (your ratings and viewing history) to predict what you\'ll enjoy watching next.',
            type: 'multiple-choice'
          },
          {
            id: 'aiml-1-q3',
            question: 'What does "training a model" mean in machine learning?',
            options: ['Teaching it to run faster', 'Feeding it data so it can learn patterns', 'Installing software updates', 'Making it more accurate by coding rules'],
            correctAnswer: 'Feeding it data so it can learn patterns',
            explanation: 'Training involves showing the model many examples so it can automatically discover patterns and relationships in the data.',
            type: 'multiple-choice'
          }
        ],
        externalResources: [
          {
            title: 'Elements of AI - Free Course',
            url: 'https://www.elementsofai.com/',
            type: 'course',
            description: 'Comprehensive introduction to AI concepts for everyone'
          },
          {
            title: 'Andrew Ng\'s Machine Learning Course',
            url: 'https://www.coursera.org/learn/machine-learning',
            type: 'course',
            description: 'The most popular ML course on the internet'
          },
          {
            title: 'Google AI Crash Course',
            url: 'https://developers.google.com/machine-learning/crash-course',
            type: 'documentation',
            description: 'Fast-paced practical introduction to ML'
          }
        ],
        gameConfig: {
          id: 'aiml-decode-matrix-1',
          type: 'pattern-builder',
          title: 'Decode the Matrix',
          description: 'Classify real-world systems as AI-powered or rule-based',
          objective: 'Identify whether systems use AI/ML to restore order in the Neural Nexus',
          controls: 'Click to classify systems',
          passingScore: 80,
          importanceWhy: 'Understanding the difference between AI and traditional programming is fundamental. This game trains you to recognize AI in the real world - from your phone\'s face unlock to spam filters. Knowing when to use AI versus rules-based systems is a critical skill for any developer.'
        }
      },
      {
        id: 'aiml-2',
        courseId: 'aiml',
        title: 'The Data Forge',
        description: 'Data & Preprocessing',
        story: 'The AI Nexus runs on Data Crystals — they\'re corrupted. You must clean, shape, and prepare them for training models.',
        narrative: 'In the machine learning realm, data is everything. But raw data is messy - missing values, inconsistencies, noise. Before any AI can learn, you must become a Data Forger, transforming chaotic information into clean, structured datasets.',
        teachingContent: 'Data comes in two types: structured (tables, databases) and unstructured (images, text, audio). Data preprocessing includes: collecting data, cleaning (removing errors/duplicates), handling missing values (fill with average, remove, or predict), normalization (scaling 0-1), standardization (mean=0, std=1), and train-test split (80/20 rule). Remember: "Garbage in, garbage out" - your model is only as good as your data!',
        xpReward: 160,
        challengeType: 'interactive',
        difficulty: 'beginner',
        unlocked: false,
        completed: false,
        currentStage: 'narrative',
        videoTopic: 'Data preprocessing and cleaning for machine learning',
        aiSuggestedVideos: [
          {
            id: 'aiml2-v1',
            title: 'Data Preprocessing in Machine Learning',
            channelTitle: 'Krish Naik',
            thumbnailUrl: 'https://i.ytimg.com/vi/7sbeT5lRi5I/maxresdefault.jpg',
            videoUrl: 'https://www.youtube.com/watch?v=7sbeT5lRi5I'
          },
          {
            id: 'aiml2-v2',
            title: 'Pandas Data Cleaning Tutorial',
            channelTitle: 'Keith Galli',
            thumbnailUrl: 'https://i.ytimg.com/vi/ZOX18HObkow/maxresdefault.jpg',
            videoUrl: 'https://www.youtube.com/watch?v=ZOX18HObkow'
          }
        ],
        quizQuestions: [
          {
            id: 'aiml-2-q1',
            question: 'Why is data preprocessing important?',
            options: ['It makes models train faster', 'Clean data leads to better model performance', 'It reduces storage needs', 'It makes code look better'],
            correctAnswer: 'Clean data leads to better model performance',
            explanation: 'Quality data directly impacts model accuracy. Missing values, outliers, and inconsistencies can confuse the model and lead to poor predictions.',
            type: 'multiple-choice'
          },
          {
            id: 'aiml-2-q2',
            question: 'What is normalization in data preprocessing?',
            options: ['Removing duplicate data', 'Scaling features to a range like 0-1', 'Fixing spelling errors', 'Converting text to numbers'],
            correctAnswer: 'Scaling features to a range like 0-1',
            explanation: 'Normalization scales numerical features to a common range (often 0-1) so features with larger values don\'t dominate the learning process.',
            type: 'multiple-choice'
          },
          {
            id: 'aiml-2-q3',
            question: 'Why do we split data into training and testing sets?',
            options: ['To save memory', 'To evaluate how well the model generalizes to new data', 'To make training faster', 'To balance the classes'],
            correctAnswer: 'To evaluate how well the model generalizes to new data',
            explanation: 'The test set simulates real-world data the model hasn\'t seen before, helping us measure if it can make accurate predictions on new examples.',
            type: 'multiple-choice'
          }
        ],
        externalResources: [
          {
            title: 'Pandas Documentation',
            url: 'https://pandas.pydata.org/docs/',
            type: 'documentation',
            description: 'Official guide for data manipulation in Python'
          },
          {
            title: 'Kaggle Learn - Pandas',
            url: 'https://www.kaggle.com/learn/pandas',
            type: 'course',
            description: 'Interactive Pandas tutorials with practice'
          },
          {
            title: 'NumPy Tutorial',
            url: 'https://numpy.org/doc/stable/user/quickstart.html',
            type: 'documentation',
            description: 'Essential library for numerical computing'
          }
        ],
        gameConfig: {
          id: 'aiml-data-smith-2',
          type: 'data-cleaning',
          title: 'Data Smith',
          description: 'Collect and clean corrupted data shards',
          objective: 'Transform messy data into clean datasets',
          controls: 'Click to clean, fill gaps, and forge data',
          passingScore: 85,
          importanceWhy: 'Data scientists spend 80% of their time cleaning data. This game simulates real challenges - missing values, outliers, inconsistent formats. Master this and you\'ll understand why quality data is more valuable than complex algorithms.'
        }
      },
      {
        id: 'aiml-3',
        courseId: 'aiml',
        title: 'The Algorithm Arena',
        description: 'ML Algorithms Basics',
        story: 'The world is run by powerful entities — Algorithms — each with its own strength. To proceed, you must battle and learn from them.',
        narrative: 'Every machine learning problem requires the right algorithm. Linear Regression predicts numbers, Logistic Regression classifies categories, Decision Trees make logical choices, K-Means groups similar data. Each algorithm is a tool in your arsenal - choose wisely!',
        teachingContent: 'ML Algorithms: Linear Regression (predict continuous values like house prices), Logistic Regression (binary classification like spam/not spam), Decision Trees (tree-like model of decisions), Random Forests (many decision trees voting together), KNN (K-Nearest Neighbors - classify based on similar examples), Naive Bayes (probability-based classification), K-Means (clustering similar data points). Each has strengths: speed, accuracy, interpretability. Choose based on your problem type and data size.',
        xpReward: 180,
        challengeType: 'interactive',
        difficulty: 'intermediate',
        unlocked: false,
        completed: false,
        currentStage: 'narrative',
        videoTopic: 'Machine learning algorithms explained with examples',
        aiSuggestedVideos: [
          {
            id: 'aiml3-v1',
            title: 'Machine Learning Algorithms Explained',
            channelTitle: 'StatQuest',
            thumbnailUrl: 'https://i.ytimg.com/vi/yN7ypxC7838/maxresdefault.jpg',
            videoUrl: 'https://www.youtube.com/watch?v=yN7ypxC7838'
          },
          {
            id: 'aiml3-v2',
            title: 'All Machine Learning Models Explained in 6 Minutes',
            channelTitle: 'The AI Hacker',
            thumbnailUrl: 'https://i.ytimg.com/vi/yN7ypxC7838/maxresdefault.jpg',
            videoUrl: 'https://www.youtube.com/watch?v=yN7ypxC7838'
          }
        ],
        quizQuestions: [
          {
            id: 'aiml-3-q1',
            question: 'Which algorithm would you use to predict house prices based on features like size and location?',
            options: ['K-Means Clustering', 'Linear Regression', 'Logistic Regression', 'Decision Tree'],
            correctAnswer: 'Linear Regression',
            explanation: 'Linear Regression predicts continuous numerical values (like prices) based on input features. It finds the best-fit line through your data points.',
            type: 'multiple-choice'
          },
          {
            id: 'aiml-3-q2',
            question: 'What is the main advantage of Random Forests over a single Decision Tree?',
            options: ['Faster training', 'More accurate and less prone to overfitting', 'Easier to interpret', 'Uses less memory'],
            correctAnswer: 'More accurate and less prone to overfitting',
            explanation: 'Random Forests combine multiple decision trees (ensemble learning), reducing overfitting and generally producing more reliable predictions than any single tree.',
            type: 'multiple-choice'
          },
          {
            id: 'aiml-3-q3',
            question: 'What type of problem is K-Means Clustering used for?',
            options: ['Predicting continuous values', 'Binary classification', 'Grouping similar data points together', 'Time series forecasting'],
            correctAnswer: 'Grouping similar data points together',
            explanation: 'K-Means is an unsupervised learning algorithm that groups (clusters) similar data points together, useful for customer segmentation, image compression, and pattern discovery.',
            type: 'multiple-choice'
          }
        ],
        externalResources: [
          {
            title: 'Scikit-learn Documentation',
            url: 'https://scikit-learn.org/stable/user_guide.html',
            type: 'documentation',
            description: 'The most popular ML library in Python'
          },
          {
            title: 'Kaggle Competitions',
            url: 'https://www.kaggle.com/competitions',
            type: 'practice',
            description: 'Practice ML on real datasets with community'
          },
          {
            title: 'StatQuest ML Playlist',
            url: 'https://www.youtube.com/playlist?list=PLblh5JKOoLUICTaGLRoHQDuF_7q2GfuJF',
            type: 'course',
            description: 'Intuitive explanations of ML algorithms'
          }
        ],
        gameConfig: {
          id: 'aiml-algorithm-battles-3',
          type: 'algorithm-selection',
          title: 'Algorithm Battles',
          description: 'Choose the right ML algorithm for each problem',
          objective: 'Match algorithms to problems and understand their properties',
          controls: 'Click to select algorithms and test them',
          passingScore: 85,
          importanceWhy: 'Choosing the right algorithm is like choosing the right tool for a job. This game teaches you when to use regression vs classification, when ensemble methods help, and how bias vs variance affects performance. These decisions separate good ML engineers from great ones.'
        }
      },
      {
        id: 'aiml-4',
        courseId: 'aiml',
        title: 'The Training Grounds',
        description: 'Model Training & Evaluation',
        story: 'You\'ve collected algorithms, but they\'re untrained warriors. Now, it\'s time to train them.',
        narrative: 'A model is only as good as its training. Learn to split data properly, avoid overfitting (memorizing instead of learning), use cross-validation for robust testing, and measure performance with the right metrics. This is where theory meets practice.',
        teachingContent: 'Training & Evaluation: Training data teaches the model, testing data evaluates it. Overfitting = model memorizes training data, fails on new data. Underfitting = model too simple to learn patterns. Cross-validation splits data into K folds for robust testing. Metrics: Accuracy (correct predictions / total), Precision (true positives / all predicted positives), Recall (true positives / all actual positives), F1 Score (balance of precision and recall), Confusion Matrix (visualizes errors). Hyperparameters (learning rate, depth, etc.) control how the model learns.',
        xpReward: 200,
        challengeType: 'interactive',
        difficulty: 'intermediate',
        unlocked: false,
        completed: false,
        currentStage: 'narrative',
        videoTopic: 'Model training, overfitting, and evaluation metrics explained',
        aiSuggestedVideos: [
          {
            id: 'aiml4-v1',
            title: 'Overfitting and Underfitting Explained',
            channelTitle: 'StatQuest',
            thumbnailUrl: 'https://i.ytimg.com/vi/EuBBz3bI-aA/maxresdefault.jpg',
            videoUrl: 'https://www.youtube.com/watch?v=EuBBz3bI-aA'
          },
          {
            id: 'aiml4-v2',
            title: 'Confusion Matrix Explained',
            channelTitle: 'Normalized Nerd',
            thumbnailUrl: 'https://i.ytimg.com/vi/Kdsp6soqA7o/maxresdefault.jpg',
            videoUrl: 'https://www.youtube.com/watch?v=Kdsp6soqA7o'
          }
        ],
        quizQuestions: [
          {
            id: 'aiml-4-q1',
            question: 'What is overfitting?',
            options: ['Model is too simple', 'Model memorizes training data and fails on new data', 'Model trains too fast', 'Model has too few parameters'],
            correctAnswer: 'Model memorizes training data and fails on new data',
            explanation: 'Overfitting occurs when a model learns the noise and specific patterns in training data so well that it fails to generalize to new, unseen data.',
            type: 'multiple-choice'
          },
          {
            id: 'aiml-4-q2',
            question: 'Why do we use a separate test set?',
            options: ['To save training time', 'To measure how well the model works on data it hasn\'t seen', 'To balance the dataset', 'To speed up predictions'],
            correctAnswer: 'To measure how well the model works on data it hasn\'t seen',
            explanation: 'The test set provides an unbiased evaluation of how the model will perform in the real world on completely new data.',
            type: 'multiple-choice'
          },
          {
            id: 'aiml-4-q3',
            question: 'What does high precision and low recall indicate?',
            options: ['Model finds all positive cases but makes many false positives', 'Model is very selective but misses many positive cases', 'Model is perfect', 'Model is completely random'],
            correctAnswer: 'Model is very selective but misses many positive cases',
            explanation: 'High precision means when the model says "yes" it\'s usually right, but low recall means it misses many actual positive cases by being too conservative.',
            type: 'multiple-choice'
          }
        ],
        externalResources: [
          {
            title: 'Cross-Validation Explained - Kaggle',
            url: 'https://www.kaggle.com/code/alexisbcook/cross-validation',
            type: 'tutorial',
            description: 'Interactive notebook on validation strategies'
          },
          {
            title: 'Model Evaluation Metrics',
            url: 'https://scikit-learn.org/stable/modules/model_evaluation.html',
            type: 'documentation',
            description: 'Complete guide to ML evaluation metrics'
          },
          {
            title: 'Hyperparameter Tuning Guide',
            url: 'https://www.kaggle.com/learn/intermediate-machine-learning',
            type: 'course',
            description: 'Learn to optimize model performance'
          }
        ],
        gameConfig: {
          id: 'aiml-train-titans-4',
          type: 'hyperparameter-tuning',
          title: 'Train the Titans',
          description: 'Tune hyperparameters to optimize model performance',
          objective: 'Adjust learning rate, depth, and other parameters to improve accuracy',
          controls: 'Click to adjust parameters and train',
          passingScore: 85,
          importanceWhy: 'Hyperparameter tuning can improve model accuracy by 10-30%. This game simulates the trial-and-error process of finding optimal settings. You\'ll learn when to increase model complexity vs reduce overfitting - a skill that defines expert ML practitioners.'
        }
      },
      {
        id: 'aiml-5',
        courseId: 'aiml',
        title: 'The Neural Sanctum',
        description: 'Intro to Neural Networks',
        story: 'Deep inside the Matrix, lies the Neural Sanctum — where intelligence is born. You\'ll learn how neurons form networks that can see, speak, and think.',
        narrative: 'Neural networks are inspired by the human brain. Individual neurons combine inputs, apply weights, use activation functions to decide if they "fire", and pass signals forward. Layer by layer, networks learn to recognize patterns - from simple edges to complex faces.',
        teachingContent: 'Neural Networks: Artificial neurons mimic brain cells. Each neuron: receives inputs, multiplies by weights, adds bias, applies activation function (ReLU, Sigmoid, Tanh). Layers: Input layer (receives data), Hidden layers (extract features), Output layer (makes prediction). Feedforward: data flows forward through network. Backpropagation: errors flow backward to update weights. Frameworks: TensorFlow and PyTorch make building networks easy. Deep Learning = neural networks with many hidden layers.',
        xpReward: 220,
        challengeType: 'interactive',
        difficulty: 'intermediate',
        unlocked: false,
        completed: false,
        currentStage: 'narrative',
        videoTopic: 'Neural networks and deep learning fundamentals',
        aiSuggestedVideos: [
          {
            id: 'aiml5-v1',
            title: 'But what is a Neural Network? | Chapter 1, Deep Learning',
            channelTitle: '3Blue1Brown',
            thumbnailUrl: 'https://i.ytimg.com/vi/aircAruvnKk/maxresdefault.jpg',
            videoUrl: 'https://www.youtube.com/watch?v=aircAruvnKk'
          },
          {
            id: 'aiml5-v2',
            title: 'Neural Networks Explained in 5 Minutes',
            channelTitle: 'IBM Technology',
            thumbnailUrl: 'https://i.ytimg.com/vi/jmmW0F0biz0/maxresdefault.jpg',
            videoUrl: 'https://www.youtube.com/watch?v=jmmW0F0biz0'
          }
        ],
        quizQuestions: [
          {
            id: 'aiml-5-q1',
            question: 'What is an activation function\'s purpose in a neural network?',
            options: ['To store data', 'To introduce non-linearity so networks can learn complex patterns', 'To speed up training', 'To reduce memory usage'],
            correctAnswer: 'To introduce non-linearity so networks can learn complex patterns',
            explanation: 'Activation functions like ReLU or Sigmoid add non-linearity, allowing neural networks to learn complex relationships. Without them, stacked layers would just be one large linear function.',
            type: 'multiple-choice'
          },
          {
            id: 'aiml-5-q2',
            question: 'What is backpropagation?',
            options: ['A method to compress neural networks', 'The algorithm that updates weights by propagating errors backward', 'A type of neural network layer', 'A data preprocessing technique'],
            correctAnswer: 'The algorithm that updates weights by propagating errors backward',
            explanation: 'Backpropagation calculates how much each weight contributed to the error and adjusts them to reduce that error, enabling the network to learn from mistakes.',
            type: 'multiple-choice'
          },
          {
            id: 'aiml-5-q3',
            question: 'What makes a neural network "deep"?',
            options: ['It processes images', 'It has many hidden layers', 'It uses a lot of data', 'It runs on GPUs'],
            correctAnswer: 'It has many hidden layers',
            explanation: 'Deep learning refers to neural networks with multiple (many) hidden layers between input and output, allowing them to learn hierarchical representations of data.',
            type: 'multiple-choice'
          }
        ],
        externalResources: [
          {
            title: 'TensorFlow Tutorials',
            url: 'https://www.tensorflow.org/tutorials',
            type: 'documentation',
            description: 'Official TensorFlow guides and tutorials'
          },
          {
            title: 'PyTorch Tutorials',
            url: 'https://pytorch.org/tutorials/',
            type: 'documentation',
            description: 'Learn PyTorch from basics to advanced'
          },
          {
            title: 'Fast.ai Course',
            url: 'https://www.fast.ai/',
            type: 'course',
            description: 'Practical deep learning for coders'
          },
          {
            title: 'Neural Networks Playground',
            url: 'https://playground.tensorflow.org/',
            type: 'practice',
            description: 'Interactive visualization of neural networks'
          }
        ],
        gameConfig: {
          id: 'aiml-neural-core-5',
          type: 'neural-network-builder',
          title: 'Build the Neural Core',
          description: 'Connect neurons to form working neural networks',
          objective: 'Complete circuits by connecting activation → hidden → output correctly',
          controls: 'Click to connect neurons and watch data flow',
          passingScore: 85,
          importanceWhy: 'Visualizing how data flows through neural networks builds intuition. This game shows how individual neurons combine to recognize patterns - start with binary classification, advance to multi-class. Understanding architecture is key to designing effective deep learning models.'
        }
      },
      {
        id: 'aiml-6',
        courseId: 'aiml',
        title: 'The Vision Tower',
        description: 'Computer Vision',
        story: 'You gain access to the Vision Tower — machines that see the world. Restore their sight by learning how images are processed.',
        narrative: 'Computer vision enables machines to see and understand images. Convolutional Neural Networks (CNNs) are the key - they use filters to detect edges, textures, and objects. From self-driving cars to medical imaging, vision AI is transforming how machines perceive reality.',
        teachingContent: 'Computer Vision: Images are grids of pixels (RGB values). Convolutional Neural Networks (CNNs): Convolutional layers apply filters to detect features (edges, textures, shapes), Pooling layers reduce size while keeping important features, Feature maps show what the network "sees", Fully connected layers at the end make predictions. Applications: Image classification (cat vs dog), Object detection (finding objects), Segmentation (outlining objects), Face recognition. Popular architectures: LeNet, AlexNet, VGG, ResNet.',
        xpReward: 240,
        challengeType: 'interactive',
        difficulty: 'advanced',
        unlocked: false,
        completed: false,
        currentStage: 'narrative',
        videoTopic: 'Convolutional neural networks and computer vision',
        aiSuggestedVideos: [
          {
            id: 'aiml6-v1',
            title: 'Convolutional Neural Networks Explained',
            channelTitle: 'Computerphile',
            thumbnailUrl: 'https://i.ytimg.com/vi/py5byOOHZM8/maxresdefault.jpg',
            videoUrl: 'https://www.youtube.com/watch?v=py5byOOHZM8'
          },
          {
            id: 'aiml6-v2',
            title: 'How Convolutional Neural Networks Work',
            channelTitle: 'Brandon Rohrer',
            thumbnailUrl: 'https://i.ytimg.com/vi/FmpDIaiMIeA/maxresdefault.jpg',
            videoUrl: 'https://www.youtube.com/watch?v=FmpDIaiMIeA'
          }
        ],
        quizQuestions: [
          {
            id: 'aiml-6-q1',
            question: 'What is the purpose of convolutional layers in a CNN?',
            options: ['To reduce image size', 'To detect features like edges and textures', 'To classify the final output', 'To add color to images'],
            correctAnswer: 'To detect features like edges and textures',
            explanation: 'Convolutional layers apply filters that scan across images to detect local patterns like edges, corners, and textures, building up to more complex features in deeper layers.',
            type: 'multiple-choice'
          },
          {
            id: 'aiml-6-q2',
            question: 'Why do we use pooling layers in CNNs?',
            options: ['To increase image resolution', 'To reduce spatial dimensions and make the network more efficient', 'To add more parameters', 'To change colors'],
            correctAnswer: 'To reduce spatial dimensions and make the network more efficient',
            explanation: 'Pooling (like max pooling) reduces the size of feature maps, keeping the most important information while reducing computation and preventing overfitting.',
            type: 'multiple-choice'
          },
          {
            id: 'aiml-6-q3',
            question: 'What type of problem is image classification?',
            options: ['Regression', 'Supervised classification', 'Unsupervised clustering', 'Reinforcement learning'],
            correctAnswer: 'Supervised classification',
            explanation: 'Image classification is supervised learning where the model learns from labeled examples (images with known categories) to predict categories of new images.',
            type: 'multiple-choice'
          }
        ],
        externalResources: [
          {
            title: 'CS231n: CNN for Visual Recognition',
            url: 'http://cs231n.stanford.edu/',
            type: 'course',
            description: 'Stanford\'s famous computer vision course'
          },
          {
            title: 'Keras Computer Vision Examples',
            url: 'https://keras.io/examples/vision/',
            type: 'tutorial',
            description: 'Practical CNN implementations'
          },
          {
            title: 'ImageNet Challenge',
            url: 'https://www.image-net.org/',
            type: 'practice',
            description: 'Famous image recognition benchmark'
          }
        ],
        gameConfig: {
          id: 'aiml-vision-tower-6',
          type: 'cnn-filter',
          title: 'Rebuild the Vision',
          description: 'Use convolution filters to process and reconstruct images',
          objective: 'Apply correct filters to restore corrupted image statues',
          controls: 'Click to apply edge detection, blur, and feature filters',
          passingScore: 85,
          importanceWhy: 'Understanding how CNNs "see" is crucial for debugging vision models. This game lets you apply real filters (edge detection, blur, sharpen) to see how networks extract features layer by layer. It\'s the foundation of facial recognition, autonomous vehicles, and medical imaging.'
        }
      },
      {
        id: 'aiml-7',
        courseId: 'aiml',
        title: 'The Voice Realm',
        description: 'NLP & Chatbots',
        story: 'Now, the Matrix starts to speak. You must understand and respond.',
        narrative: 'Natural Language Processing (NLP) enables machines to understand human language. From chatbots to translation, sentiment analysis to text generation - NLP is how AI communicates. You\'ll learn to process text, extract meaning, and build conversational AI.',
        teachingContent: 'NLP Basics: Tokenization (split text into words/tokens), Stemming (reduce to root: running → run), Lemmatization (better stemming: better → good), Stop words (remove "the", "is", "and"). Bag of Words (count word frequency), TF-IDF (weight by importance). RNNs process sequences, LSTMs remember long-term context, Transformers (like GPT) revolutionized NLP with attention mechanisms. Chatbots: Rule-based (if/else), Retrieval-based (pick from responses), Generative (create new responses).',
        xpReward: 260,
        challengeType: 'interactive',
        difficulty: 'advanced',
        unlocked: false,
        completed: false,
        currentStage: 'narrative',
        videoTopic: 'Natural language processing and chatbots explained',
        aiSuggestedVideos: [
          {
            id: 'aiml7-v1',
            title: 'Natural Language Processing in 5 Minutes',
            channelTitle: 'AI Explained',
            thumbnailUrl: 'https://i.ytimg.com/vi/fOvTtapxa9c/maxresdefault.jpg',
            videoUrl: 'https://www.youtube.com/watch?v=fOvTtapxa9c'
          },
          {
            id: 'aiml7-v2',
            title: 'Illustrated Guide to Transformers',
            channelTitle: 'Jay Alammar',
            thumbnailUrl: 'https://i.ytimg.com/vi/4Bdc55j80l8/maxresdefault.jpg',
            videoUrl: 'https://www.youtube.com/watch?v=4Bdc55j80l8'
          }
        ],
        quizQuestions: [
          {
            id: 'aiml-7-q1',
            question: 'What is tokenization in NLP?',
            options: ['Translating text to another language', 'Breaking text into individual words or tokens', 'Removing punctuation', 'Checking grammar'],
            correctAnswer: 'Breaking text into individual words or tokens',
            explanation: 'Tokenization splits text into meaningful units (tokens) - usually words or subwords - which is the first step in most NLP pipelines.',
            type: 'multiple-choice'
          },
          {
            id: 'aiml-7-q2',
            question: 'What advantage do Transformers have over RNNs for NLP?',
            options: ['They use less memory', 'They can process sequences in parallel and capture long-range dependencies better', 'They don\'t need training', 'They only work on short text'],
            correctAnswer: 'They can process sequences in parallel and capture long-range dependencies better',
            explanation: 'Transformers use attention mechanisms to process all tokens simultaneously and relate distant words effectively, unlike RNNs which process sequentially and struggle with long-term memory.',
            type: 'multiple-choice'
          },
          {
            id: 'aiml-7-q3',
            question: 'What type of chatbot is ChatGPT?',
            options: ['Rule-based', 'Retrieval-based', 'Generative', 'Random'],
            correctAnswer: 'Generative',
            explanation: 'ChatGPT is a generative model that creates new responses based on its training, rather than selecting from pre-written responses or following hardcoded rules.',
            type: 'multiple-choice'
          }
        ],
        externalResources: [
          {
            title: 'Hugging Face NLP Course',
            url: 'https://huggingface.co/learn/nlp-course',
            type: 'course',
            description: 'Comprehensive course on modern NLP'
          },
          {
            title: 'spaCy Tutorials',
            url: 'https://spacy.io/usage',
            type: 'documentation',
            description: 'Industrial-strength NLP library'
          },
          {
            title: 'Building Chatbots with Python',
            url: 'https://www.datacamp.com/courses/building-chatbots-in-python',
            type: 'course',
            description: 'Hands-on chatbot development'
          }
        ],
        gameConfig: {
          id: 'aiml-echo-words-7',
          type: 'nlp-processing',
          title: 'Echo of Words',
          description: 'Decode and clean corrupted text messages',
          objective: 'Process text data and train a mini chatbot',
          controls: 'Click to tokenize, clean, and respond',
          passingScore: 85,
          importanceWhy: 'Text processing is everywhere - search engines, spam filters, autocomplete, translation. This game teaches you to clean messy text and understand how chatbots map questions to answers. It\'s the foundation of conversational AI that powers virtual assistants and customer service bots.'
        }
      },
      {
        id: 'aiml-8',
        courseId: 'aiml',
        title: 'The Sage\'s Code',
        description: 'AI Ethics & Explainability',
        story: 'Power must be balanced with wisdom. Learn the ethics of using AI responsibly.',
        narrative: 'AI is powerful, but with power comes responsibility. Biased data creates biased AI. Models can discriminate, invade privacy, or be misused. You must learn to build fair, transparent, explainable AI that serves humanity ethically.',
        teachingContent: 'AI Ethics: Bias in data leads to biased predictions (facial recognition less accurate on minorities, hiring AI favoring men). Fairness means equal treatment across groups. Explainable AI (XAI) helps us understand why models make decisions. Privacy concerns: models can memorize sensitive training data. Transparency: users should know when AI makes decisions about them. Accountability: who\'s responsible when AI makes mistakes? Responsible AI practices: diverse datasets, regular bias testing, human oversight, clear documentation.',
        xpReward: 280,
        challengeType: 'interactive',
        difficulty: 'advanced',
        unlocked: false,
        completed: false,
        currentStage: 'narrative',
        videoTopic: 'AI ethics, bias, and responsible artificial intelligence',
        aiSuggestedVideos: [
          {
            id: 'aiml8-v1',
            title: 'AI Ethics and Bias Explained',
            channelTitle: 'CrashCourse AI',
            thumbnailUrl: 'https://i.ytimg.com/vi/AlusjivRJV0/maxresdefault.jpg',
            videoUrl: 'https://www.youtube.com/watch?v=AlusjivRJV0'
          },
          {
            id: 'aiml8-v2',
            title: 'Explainable AI (XAI) Explained',
            channelTitle: 'IBM Technology',
            thumbnailUrl: 'https://i.ytimg.com/vi/T4TsOA-U7dk/maxresdefault.jpg',
            videoUrl: 'https://www.youtube.com/watch?v=T4TsOA-U7dk'
          }
        ],
        quizQuestions: [
          {
            id: 'aiml-8-q1',
            question: 'Why is AI bias a serious concern?',
            options: ['It makes models slower', 'Biased models can discriminate and harm marginalized groups', 'It increases training costs', 'It makes models harder to deploy'],
            correctAnswer: 'Biased models can discriminate and harm marginalized groups',
            explanation: 'AI systems trained on biased data can perpetuate and amplify discrimination in critical areas like hiring, lending, criminal justice, and healthcare, causing real harm to people.',
            type: 'multiple-choice'
          },
          {
            id: 'aiml-8-q2',
            question: 'What is Explainable AI (XAI)?',
            options: ['AI that talks to humans', 'Methods to understand and interpret how AI makes decisions', 'AI that explains code', 'Simpler AI models'],
            correctAnswer: 'Methods to understand and interpret how AI makes decisions',
            explanation: 'XAI provides insights into why models make certain predictions, which is crucial for trust, debugging, and meeting regulatory requirements in sensitive domains.',
            type: 'multiple-choice'
          },
          {
            id: 'aiml-8-q3',
            question: 'In the ethics of AI deployment, what does the "accountability" principle mean?',
            options: ['Making AI faster', 'Ensuring someone is responsible for AI decisions and outcomes', 'Reducing costs', 'Increasing accuracy'],
            correctAnswer: 'Ensuring someone is responsible for AI decisions and outcomes',
            explanation: 'Accountability means there must be clear responsibility when AI systems make errors or cause harm, with processes to address and remedy negative outcomes.',
            type: 'multiple-choice'
          }
        ],
        externalResources: [
          {
            title: 'AI Ethics Guidelines - EU',
            url: 'https://digital-strategy.ec.europa.eu/en/policies/expert-group-ai',
            type: 'documentation',
            description: 'European Union\'s ethical AI framework'
          },
          {
            title: 'Responsible AI Practices - Google',
            url: 'https://ai.google/responsibility/responsible-ai-practices/',
            type: 'documentation',
            description: 'Google\'s guide to responsible AI development'
          },
          {
            title: 'AI Fairness 360 Toolkit',
            url: 'https://aif360.mybluemix.net/',
            type: 'tool',
            description: 'IBM toolkit for detecting and mitigating bias'
          },
          {
            title: 'Ethics of AI Course - MIT',
            url: 'https://ethics.fast.ai/',
            type: 'course',
            description: 'Practical ethics for data scientists'
          }
        ],
        gameConfig: {
          id: 'aiml-balance-matrix-8',
          type: 'ethics-decision',
          title: 'Balance of the Matrix',
          description: 'Make ethical AI decisions in branching scenarios',
          objective: 'Balance fairness, accuracy, and transparency in real-world situations',
          controls: 'Choose decisions and see their impact on different groups',
          passingScore: 85,
          importanceWhy: 'AI ethics isn\'t abstract - it\'s about real decisions with real consequences. This game presents scenarios like: "High accuracy but unfair to minorities" vs "Lower accuracy but more fair". You\'ll see how bias metrics, fairness constraints, and transparency affect people\'s lives. Every AI developer needs this perspective.'
        }
      },
      {
        id: 'aiml-9',
        courseId: 'aiml',
        title: 'The Integration Nexus',
        description: 'AI Projects & APIs',
        story: 'Time to build your legacy — merge all your knowledge to create something real.',
        narrative: 'You\'ve mastered the theory. Now build real AI applications! Use powerful APIs like OpenAI, Hugging Face, and Google Gemini to add AI to your apps. Deploy models with Flask or FastAPI. Create image classifiers, chatbots, sentiment analyzers. This is where you become a true AI architect.',
        teachingContent: 'Real-World AI: AI APIs provide pre-trained models: OpenAI (GPT for text generation, DALL-E for images), Hugging Face (thousands of models), Google Gemini (multimodal AI). Projects: Image classification (CNN + user uploads), Chatbot (NLP + conversation logic), Sentiment analysis (classify emotions in text), Recommendation system (collaborative filtering). Deployment: Flask/FastAPI for web APIs, Streamlit for quick demos, Docker for containers, Cloud platforms (AWS, GCP, Azure) for scalability. MLOps: versioning models, monitoring performance, A/B testing.',
        xpReward: 300,
        challengeType: 'interactive',
        difficulty: 'advanced',
        unlocked: false,
        completed: false,
        currentStage: 'narrative',
        videoTopic: 'Building and deploying machine learning projects with APIs',
        aiSuggestedVideos: [
          {
            id: 'aiml9-v1',
            title: 'Deploy Machine Learning Models with Flask',
            channelTitle: 'Krish Naik',
            thumbnailUrl: 'https://i.ytimg.com/vi/UbCWoMf80PY/maxresdefault.jpg',
            videoUrl: 'https://www.youtube.com/watch?v=UbCWoMf80PY'
          },
          {
            id: 'aiml9-v2',
            title: 'OpenAI API Tutorial',
            channelTitle: 'Tech With Tim',
            thumbnailUrl: 'https://i.ytimg.com/vi/c-g6epk3fFE/maxresdefault.jpg',
            videoUrl: 'https://www.youtube.com/watch?v=c-g6epk3fFE'
          }
        ],
        quizQuestions: [
          {
            id: 'aiml-9-q1',
            question: 'Why use AI APIs instead of building models from scratch?',
            options: ['APIs are always free', 'APIs provide access to powerful pre-trained models, saving time and resources', 'APIs are faster to run', 'You don\'t need data with APIs'],
            correctAnswer: 'APIs provide access to powerful pre-trained models, saving time and resources',
            explanation: 'AI APIs let you leverage models trained on massive datasets with huge computational resources, which would be impractical to replicate. You get state-of-the-art capabilities immediately.',
            type: 'multiple-choice'
          },
          {
            id: 'aiml-9-q2',
            question: 'What is Flask commonly used for in ML projects?',
            options: ['Training models', 'Creating web APIs to serve model predictions', 'Data cleaning', 'Image processing'],
            correctAnswer: 'Creating web APIs to serve model predictions',
            explanation: 'Flask is a lightweight Python web framework perfect for creating REST APIs that receive input, run model inference, and return predictions to users or applications.',
            type: 'multiple-choice'
          },
          {
            id: 'aiml-9-q3',
            question: 'What is MLOps?',
            options: ['A type of neural network', 'Practices for deploying, monitoring, and maintaining ML systems in production', 'A programming language', 'A data visualization tool'],
            correctAnswer: 'Practices for deploying, monitoring, and maintaining ML systems in production',
            explanation: 'MLOps (Machine Learning Operations) combines ML, DevOps, and data engineering to automate and improve the process of taking ML models from development to production.',
            type: 'multiple-choice'
          }
        ],
        externalResources: [
          {
            title: 'OpenAI API Documentation',
            url: 'https://platform.openai.com/docs',
            type: 'documentation',
            description: 'Official guide to OpenAI\'s powerful AI models'
          },
          {
            title: 'Hugging Face Models',
            url: 'https://huggingface.co/models',
            type: 'platform',
            description: 'Thousands of pre-trained AI models'
          },
          {
            title: 'FastAPI ML Tutorial',
            url: 'https://fastapi.tiangolo.com/tutorial/',
            type: 'tutorial',
            description: 'Modern Python web framework for APIs'
          },
          {
            title: 'End-to-End ML Projects - Kaggle',
            url: 'https://www.kaggle.com/learn',
            type: 'practice',
            description: 'Complete ML workflows from data to deployment'
          },
          {
            title: 'MLOps Guide',
            url: 'https://ml-ops.org/',
            type: 'documentation',
            description: 'Best practices for production ML systems'
          }
        ],
        gameConfig: {
          id: 'aiml-architect-matrix-9',
          type: 'deploy-orbit',
          title: 'Architect of the Matrix',
          description: 'Build and deploy your own AI-powered system',
          objective: 'Choose tools, models, and architecture to create a working AI application',
          controls: 'Click to select components and deploy',
          passingScore: 90,
          importanceWhy: 'This is your final boss - building a real AI system from scratch. You\'ll choose between different APIs (OpenAI vs Hugging Face), decide on architecture (REST vs WebSocket), handle errors, and deploy. It simulates the full stack of decisions AI engineers make daily. Complete this and you\'re ready to build real AI products.'
        }
      }
    ]
  },
  {
    id: 'cloud',
    name: 'Cloud & DevOps',
    description: 'Deploy and scale applications',
    icon: '☁️',
    color: '#10b981',
    levels: [
      {
        id: 'cloud-1',
        courseId: 'cloud',
        title: 'Cloud Computing Basics',
        description: 'Introduction to cloud platforms',
        story: 'Ascend to the Cloud City and learn to deploy your applications to the sky!',
        xpReward: 100,
        challengeType: 'quiz',
        difficulty: 'beginner',
        unlocked: true,
        completed: false,
      },
      {
        id: 'cloud-2',
        courseId: 'cloud',
        title: 'Docker Containers',
        description: 'Containerize your applications',
        story: 'Master the art of containerization in the Docker Docks.',
        xpReward: 150,
        challengeType: 'interactive',
        difficulty: 'intermediate',
        unlocked: false,
        completed: false,
      }
    ]
  }
];

export const useLearning = create<LearningState>()(
  persist(
    (set, get) => ({
      user: null,
      courses: initialCourses,
      userProgress: {
        userId: 'guest',
        totalXP: 0,
        level: 1,
        badges: [],
        completedLevels: [],
        currentCourse: null,
        currentLevel: null,
      },
      aiCompanion: {
        isActive: false,
        messages: [],
        currentHint: null,
        adaptiveDifficulty: 1,
      },
      
      login: async (username: string, password: string) => {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Login failed');
        }
        
        const data = await response.json();
        set({ user: data.user });
        
        await get().syncProgress();
      },
      
      signup: async (username: string, password: string, email?: string) => {
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password, email }),
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Signup failed');
        }
        
        const data = await response.json();
        set({ user: data.user });
        
        await get().syncProgress();
      },
      
      logout: () => {
        set({
          user: null,
          userProgress: {
            userId: 'guest',
            totalXP: 0,
            level: 1,
            badges: [],
            completedLevels: [],
            currentCourse: null,
            currentLevel: null,
          }
        });
      },
      
      syncProgress: async () => {
        const { user } = get();
        if (!user) return;
        
        try {
          const response = await fetch(`/api/progress`);
          if (response.ok) {
            const data = await response.json();
            
            if (data.progress) {
              set((state) => ({
                userProgress: {
                  userId: user.id.toString(),
                  totalXP: data.progress.totalXP || 0,
                  level: data.progress.level || 1,
                  badges: data.badges || [],
                  completedLevels: data.completedLevels?.map((cl: any) => cl.levelId) || [],
                  currentCourse: data.progress.currentCourse,
                  currentLevel: data.progress.currentLevel,
                },
                courses: state.courses.map(course => ({
                  ...course,
                  levels: course.levels.map((level, index) => {
                    const isCompleted = data.completedLevels?.some((cl: any) => cl.levelId === level.id);
                    const prevCompleted = index === 0 || data.completedLevels?.some((cl: any) => cl.levelId === course.levels[index - 1].id);
                    return {
                      ...level,
                      completed: isCompleted,
                      unlocked: index === 0 || prevCompleted,
                    };
                  })
                }))
              }));
            }
          }
        } catch (error) {
          console.error('Failed to sync progress:', error);
        }
      },
      
      setCourses: (courses) => set({ courses }),
      
      selectCourse: (courseId) => set((state) => ({
        userProgress: {
          ...state.userProgress,
          currentCourse: courseId,
          currentLevel: null,
        }
      })),
      
      selectLevel: (levelId) => {
        set((state) => {
          const updatedCourses = state.courses.map(course => ({
            ...course,
            levels: course.levels.map(level => 
              level.id === levelId 
                ? { ...level, currentStage: 'narrative' as LevelStage }
                : level
            )
          }));
          
          return {
            courses: updatedCourses,
            userProgress: {
              ...state.userProgress,
              currentLevel: levelId,
            }
          };
        });
      },
      
      advanceStage: (levelId, newStage) => {
        const stageOrder: LevelStage[] = ['narrative', 'teaching-game', 'ai-videos', 'assessment', 'practice-game', 'resources', 'complete'];

        const state = get();
        const level = state.courses
          .flatMap(c => c.levels)
          .find(l => l.id === levelId);

        if (!level) {
          console.error(`Level ${levelId} not found`);
          return false;
        }

        const currentStage = level.currentStage || 'narrative';

        if (currentStage === newStage) {
          console.warn(`Level already on stage ${newStage}`);
          return false;
        }

        const currentIndex = stageOrder.indexOf(currentStage);
        const newIndex = stageOrder.indexOf(newStage);

        const hasGame = !!level.gameConfig;
        const hasResources = !!level.externalResources && level.externalResources.length > 0;

        const isValidTransition =
          newIndex > currentIndex ||
          (newIndex === stageOrder.indexOf('complete') && !hasResources && currentStage === 'practice-game') ||
          (newIndex === 0 && currentStage !== 'teaching-game') ||
          (currentStage === 'ai-videos' && newStage === 'teaching-game');

        if (!isValidTransition) {
          console.error(`Invalid stage transition from ${currentStage} to ${newStage}`);
          return false;
        }

        set((state) => ({
          courses: state.courses.map(course => ({
            ...course,
            levels: course.levels.map(level =>
              level.id === levelId
                ? { ...level, currentStage: newStage }
                : level
            )
          }))
        }));

        return true;
      },

      goBackStage: (levelId) => {
        const stageOrder: LevelStage[] = ['narrative', 'teaching-game', 'ai-videos', 'assessment', 'practice-game', 'resources', 'complete'];

        const state = get();
        const level = state.courses
          .flatMap(c => c.levels)
          .find(l => l.id === levelId);

        if (!level) {
          console.error(`Level ${levelId} not found`);
          return false;
        }

        const currentStage = level.currentStage || 'narrative';
        const currentIndex = stageOrder.indexOf(currentStage);

        if (currentIndex <= 0) {
          console.warn(`Cannot go back from the first stage: ${currentStage}`);
          return false;
        }

        const previousStage = stageOrder[currentIndex - 1];

        set((state) => ({
          courses: state.courses.map(course => ({
            ...course,
            levels: course.levels.map(level =>
              level.id === levelId
                ? { ...level, currentStage: previousStage }
                : level
            )
          }))
        }));

        return true;
      },
      
      startGame: (levelId) => {
        const { courses, userProgress } = get();
        const level = courses
          .flatMap(c => c.levels)
          .find(l => l.id === levelId);
        
        if (!level?.gameConfig) {
          console.error('No game config found for level:', levelId);
          return false;
        }
        
        const currentStage = level.currentStage || 'narrative';
        if (currentStage !== 'practice-game' && currentStage !== 'teaching-game') {
          console.error(`Cannot start game from stage ${currentStage}. Must be in practice-game or teaching-game stage.`);
          return false;
        }
        
        const existingGame = userProgress.currentGame;
        const isResuming = existingGame?.levelId === levelId;
        
        set((state) => ({
          userProgress: {
            ...state.userProgress,
            currentGame: {
              levelId,
              gameId: level.gameConfig!.id,
              attempts: isResuming && existingGame ? existingGame.attempts : 0,
              bestScore: isResuming && existingGame ? existingGame.bestScore : 0,
              timeSpent: isResuming && existingGame ? existingGame.timeSpent : 0,
              completed: false,
            }
          }
        }));
        
        return true;
      },
      
      completeGame: async (levelId, result) => {
        const { userProgress } = get();
        
        const currentGame = userProgress.currentGame;
        if (!currentGame) {
          console.error('No active game session to complete');
          return;
        }
        
        const newBestScore = Math.max(currentGame.bestScore, result.score);
        const newAttempts = currentGame.attempts + 1;
        const newTimeSpent = currentGame.timeSpent + result.timeSpent;
        
        if (result.success) {
          set((state) => ({
            userProgress: {
              ...state.userProgress,
              currentGame: {
                ...currentGame,
                attempts: newAttempts,
                bestScore: newBestScore,
                timeSpent: newTimeSpent,
                completed: true,
              }
            }
          }));
          
          await get().completeLevel(levelId, result.xpEarned);

          get().advanceStage(levelId, 'assessment');
          
          set((state) => ({
            userProgress: {
              ...state.userProgress,
              currentGame: null,
            }
          }));
        } else {
          set((state) => ({
            userProgress: {
              ...state.userProgress,
              currentGame: {
                ...currentGame,
                attempts: newAttempts,
                bestScore: newBestScore,
                timeSpent: newTimeSpent,
              }
            }
          }));
        }
      },
      
      completeLevel: async (levelId, xpEarned) => {
        const { user, userProgress, courses } = get();
        const newTotalXP = userProgress.totalXP + xpEarned;
        const newLevel = Math.floor(newTotalXP / 500) + 1;
        
        const courseId = courses.find(c => c.levels.some(l => l.id === levelId))?.id || '';
        
        const updatedCourses = courses.map(course => ({
          ...course,
          levels: course.levels.map((level, index) => {
            if (level.id === levelId) {
              return { ...level, completed: true };
            }
            if (course.levels[index - 1]?.id === levelId) {
              return { ...level, unlocked: true };
            }
            return level;
          })
        }));
        
        set({
          courses: updatedCourses,
          userProgress: {
            ...userProgress,
            totalXP: newTotalXP,
            level: newLevel,
            completedLevels: [...userProgress.completedLevels, levelId],
          }
        });
        
        if (user) {
          try {
            await fetch('/api/progress/complete-level', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ levelId, courseId, xpEarned }),
            });
            
            await fetch('/api/progress/update', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                totalXP: newTotalXP,
                level: newLevel,
                currentCourse: courseId,
                currentLevel: levelId,
              }),
            });
          } catch (error) {
            console.error('Failed to save progress to database:', error);
          }
        }
      },
      
      addBadge: async (badge) => {
        const { user } = get();
        
        set((state) => ({
          userProgress: {
            ...state.userProgress,
            badges: [...state.userProgress.badges, badge],
          }
        }));
        
        if (user) {
          try {
            await fetch('/api/badges/earn', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                badgeId: badge.id,
                name: badge.name,
                description: badge.description,
                icon: badge.icon,
                rarity: badge.rarity || 'common',
              }),
            });
          } catch (error) {
            console.error('Failed to save badge to database:', error);
          }
        }
      },
      
      updateAIMessages: (message) => set((state) => ({
        aiCompanion: {
          ...state.aiCompanion,
          messages: [
            ...state.aiCompanion.messages,
            { ...message, timestamp: new Date() }
          ]
        }
      })),
      
      toggleAICompanion: () => set((state) => ({
        aiCompanion: {
          ...state.aiCompanion,
          isActive: !state.aiCompanion.isActive,
        }
      })),
      
      setCurrentHint: (hint) => set((state) => ({
        aiCompanion: {
          ...state.aiCompanion,
          currentHint: hint,
        }
      })),
    }),
    {
      name: 'skillquest-learning',
      version: 3,
      migrate: (persistedState: any, version: number) => {
        if (version < 2) {
          console.log('Migrating from version', version, 'to version 2 - Resetting all level stages');
          
          if (persistedState.courses) {
            persistedState.courses = persistedState.courses.map((course: any) => ({
              ...course,
              levels: course.levels.map((level: any) => ({
                ...level,
                currentStage: 'narrative'
              }))
            }));
          }
          
          if (persistedState.userProgress) {
            persistedState.userProgress.currentLevel = null;
          }
        }
        return persistedState;
      }
    }
  )
);
