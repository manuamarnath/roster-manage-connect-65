
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types for better data integrity
CREATE TYPE user_role AS ENUM ('owner', 'admin', 'employee');
CREATE TYPE leave_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE task_status AS ENUM ('pending', 'in_progress', 'completed');
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high');

-- Create profiles table to store additional user information
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'employee',
  department TEXT,
  join_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create attendance table
CREATE TABLE public.attendance (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  check_in_time TIME,
  check_out_time TIME,
  status TEXT DEFAULT 'present',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Create leave_requests table
CREATE TABLE public.leave_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT NOT NULL,
  status leave_status DEFAULT 'pending',
  emergency_contact TEXT,
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create work_reports table
CREATE TABLE public.work_reports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  hours_worked DECIMAL(4,2),
  tasks_completed TEXT NOT NULL,
  achievements TEXT,
  challenges TEXT,
  next_day_plan TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Create tasks table
CREATE TABLE public.tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  assignee_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  assigned_by UUID REFERENCES auth.users(id) NOT NULL,
  priority task_priority DEFAULT 'medium',
  status task_status DEFAULT 'pending',
  due_date DATE NOT NULL,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins and owners can insert profiles" ON public.profiles FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'owner')
  ) OR NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid())
);

-- Create RLS policies for attendance
CREATE POLICY "Users can view own attendance" ON public.attendance FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins and owners can view all attendance" ON public.attendance FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'owner')
  )
);
CREATE POLICY "Users can insert own attendance" ON public.attendance FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own attendance" ON public.attendance FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for leave_requests
CREATE POLICY "Users can view own leave requests" ON public.leave_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins and owners can view all leave requests" ON public.leave_requests FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'owner')
  )
);
CREATE POLICY "Users can insert own leave requests" ON public.leave_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins and owners can update leave requests" ON public.leave_requests FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'owner')
  )
);

-- Create RLS policies for work_reports
CREATE POLICY "Users can view own work reports" ON public.work_reports FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins and owners can view all work reports" ON public.work_reports FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'owner')
  )
);
CREATE POLICY "Users can insert own work reports" ON public.work_reports FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own work reports" ON public.work_reports FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for tasks
CREATE POLICY "Users can view own assigned tasks" ON public.tasks FOR SELECT USING (auth.uid() = assignee_id);
CREATE POLICY "Admins and owners can view all tasks" ON public.tasks FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'owner')
  )
);
CREATE POLICY "Admins and owners can manage tasks" ON public.tasks FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'owner')
  )
);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    NEW.email,
    'employee'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
