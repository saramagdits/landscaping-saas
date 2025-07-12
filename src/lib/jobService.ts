import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  Timestamp,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from './firebase';

export interface JobEvent {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  location?: string;
  client?: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  assignedTo?: string;
  notes?: string;
  userId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CreateJobData {
  title: string;
  description?: string;
  start: Date;
  end: Date;
  location?: string;
  client?: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  assignedTo?: string;
  notes?: string;
}

export interface UpdateJobData extends Partial<CreateJobData> {
  updatedAt: Timestamp;
}

class JobService {
  private static instance: JobService;
  private readonly COLLECTION_NAME = 'jobs';

  private constructor() {}

  public static getInstance(): JobService {
    if (!JobService.instance) {
      JobService.instance = new JobService();
    }
    return JobService.instance;
  }

  // Get all jobs for a user
  async getJobs(userId: string, options?: {
    status?: string;
    priority?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }): Promise<JobEvent[]> {
    try {
      let q = query(
        collection(db, this.COLLECTION_NAME),
        where('userId', '==', userId),
        orderBy('start', 'asc')
      );

      // Add filters if provided
      if (options?.status) {
        q = query(q, where('status', '==', options.status));
      }
      if (options?.priority) {
        q = query(q, where('priority', '==', options.priority));
      }
      if (options?.startDate) {
        q = query(q, where('start', '>=', Timestamp.fromDate(options.startDate)));
      }
      if (options?.endDate) {
        q = query(q, where('end', '<=', Timestamp.fromDate(options.endDate)));
      }
      if (options?.limit) {
        q = query(q, limit(options.limit));
      }

      const querySnapshot = await getDocs(q);
      const jobs: JobEvent[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        jobs.push({
          id: doc.id,
          title: data.title,
          description: data.description,
          start: data.start.toDate(),
          end: data.end.toDate(),
          location: data.location,
          client: data.client,
          status: data.status,
          priority: data.priority,
          assignedTo: data.assignedTo,
          notes: data.notes,
          userId: data.userId,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        });
      });

      return jobs;
    } catch (error) {
      console.error('Error fetching jobs:', error);
      throw new Error('Failed to fetch jobs');
    }
  }

  // Get a single job by ID
  async getJob(jobId: string): Promise<JobEvent | null> {
    try {
      const jobDoc = await getDocs(query(
        collection(db, this.COLLECTION_NAME),
        where('__name__', '==', jobId)
      ));

      if (jobDoc.empty) {
        return null;
      }

      const doc = jobDoc.docs[0];
      const data = doc.data();

      return {
        id: doc.id,
        title: data.title,
        description: data.description,
        start: data.start.toDate(),
        end: data.end.toDate(),
        location: data.location,
        client: data.client,
        status: data.status,
        priority: data.priority,
        assignedTo: data.assignedTo,
        notes: data.notes,
        userId: data.userId,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      };
    } catch (error) {
      console.error('Error fetching job:', error);
      throw new Error('Failed to fetch job');
    }
  }

  // Create a new job
  async createJob(userId: string, jobData: CreateJobData): Promise<JobEvent> {
    try {
      // Validate required fields
      if (!jobData.title || !jobData.start || !jobData.end) {
        throw new Error('Title, start date, and end date are required');
      }

      // Validate dates
      if (jobData.start >= jobData.end) {
        throw new Error('End date must be after start date');
      }

      const newJob = {
        ...jobData,
        userId,
        start: Timestamp.fromDate(jobData.start),
        end: Timestamp.fromDate(jobData.end),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      const docRef = await addDoc(collection(db, this.COLLECTION_NAME), newJob);
      
      return {
        id: docRef.id,
        ...jobData,
        userId,
        createdAt: newJob.createdAt,
        updatedAt: newJob.updatedAt
      } as JobEvent;
    } catch (error) {
      console.error('Error creating job:', error);
      throw error;
    }
  }

  // Update an existing job
  async updateJob(jobId: string, userId: string, jobData: Partial<CreateJobData>): Promise<void> {
    try {
      // Validate dates if both are provided
      if (jobData.start && jobData.end && jobData.start >= jobData.end) {
        throw new Error('End date must be after start date');
      }

      const updateData: any = {
        ...jobData,
        updatedAt: Timestamp.now()
      };

      // Convert dates to Timestamps if provided
      if (jobData.start) {
        updateData.start = Timestamp.fromDate(jobData.start);
      }
      if (jobData.end) {
        updateData.end = Timestamp.fromDate(jobData.end);
      }

      const jobRef = doc(db, this.COLLECTION_NAME, jobId);
      await updateDoc(jobRef, updateData);
    } catch (error) {
      console.error('Error updating job:', error);
      throw error;
    }
  }

  // Delete a job
  async deleteJob(jobId: string, userId: string): Promise<void> {
    try {
      // Verify the job belongs to the user
      const job = await this.getJob(jobId);
      if (!job || job.userId !== userId) {
        throw new Error('Job not found or access denied');
      }

      await deleteDoc(doc(db, this.COLLECTION_NAME, jobId));
    } catch (error) {
      console.error('Error deleting job:', error);
      throw error;
    }
  }

  // Get jobs by status
  async getJobsByStatus(userId: string, status: string): Promise<JobEvent[]> {
    return this.getJobs(userId, { status });
  }

  // Get jobs by priority
  async getJobsByPriority(userId: string, priority: string): Promise<JobEvent[]> {
    return this.getJobs(userId, { priority });
  }

  // Get upcoming jobs (jobs starting in the next 7 days)
  async getUpcomingJobs(userId: string): Promise<JobEvent[]> {
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return this.getJobs(userId, {
      startDate: now,
      endDate: nextWeek,
      status: 'scheduled'
    });
  }

  // Get jobs for a specific date range
  async getJobsByDateRange(userId: string, startDate: Date, endDate: Date): Promise<JobEvent[]> {
    return this.getJobs(userId, { startDate, endDate });
  }

  // Get job statistics
  async getJobStats(userId: string): Promise<{
    total: number;
    scheduled: number;
    inProgress: number;
    completed: number;
    cancelled: number;
    highPriority: number;
    mediumPriority: number;
    lowPriority: number;
  }> {
    try {
      const jobs = await this.getJobs(userId);
      
      const stats = {
        total: jobs.length,
        scheduled: jobs.filter(job => job.status === 'scheduled').length,
        inProgress: jobs.filter(job => job.status === 'in-progress').length,
        completed: jobs.filter(job => job.status === 'completed').length,
        cancelled: jobs.filter(job => job.status === 'cancelled').length,
        highPriority: jobs.filter(job => job.priority === 'high').length,
        mediumPriority: jobs.filter(job => job.priority === 'medium').length,
        lowPriority: jobs.filter(job => job.priority === 'low').length,
      };

      return stats;
    } catch (error) {
      console.error('Error fetching job stats:', error);
      throw new Error('Failed to fetch job statistics');
    }
  }

  // Search jobs by title or description
  async searchJobs(userId: string, searchTerm: string): Promise<JobEvent[]> {
    try {
      const jobs = await this.getJobs(userId);
      const searchLower = searchTerm.toLowerCase();
      
      return jobs.filter(job => 
        job.title.toLowerCase().includes(searchLower) ||
        (job.description && job.description.toLowerCase().includes(searchLower)) ||
        (job.client && job.client.toLowerCase().includes(searchLower)) ||
        (job.location && job.location.toLowerCase().includes(searchLower))
      );
    } catch (error) {
      console.error('Error searching jobs:', error);
      throw new Error('Failed to search jobs');
    }
  }
}

export const jobService = JobService.getInstance(); 