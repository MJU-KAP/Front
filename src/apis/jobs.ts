import axios from 'axios';

export interface JobTrendData {
  id: number;
  title: string;
  count: number;
}

export const PROGRAMMING_ROLES = [
  { title: 'Frontend', job_cd: '92' },
  { title: 'Backend', job_cd: '86' },
  { title: 'Full Stack', job_cd: '84' },
  { title: 'AI Engineer', job_cd: '95' },
  { title: 'DevOps', job_cd: '93' },
  { title: 'Data Engineer', job_cd: '89' },
  { title: 'Android', job_cd: '87' },
  { title: 'iOS', job_cd: '88' },
  { title: 'Game Client', job_cd: '2072' }
];

export const fetchJobTrends = async (targetRoles = PROGRAMMING_ROLES): Promise<JobTrendData[]> => {
  try {
    const promises = targetRoles.map(async (role) => {
      const response = await axios.get('/saramin/job-search', {
        headers: {
          'Accept': 'application/json'
        },
        params: {
          'access-key': import.meta.env.VITE_SARAMIN_API_KEY,
          'job_cd': role.job_cd,
          'count': 1, 
        }
      });

      const totalPostings = response.data.jobs?.total ? parseInt(response.data.jobs.total, 10) : 0;

      return {
        title: role.title,
        count: totalPostings,
      };
    });

    const results = await Promise.all(promises);
    results.sort((a, b) => b.count - a.count);

    const formattedData: JobTrendData[] = results.slice(0, 5).map((item, index) => ({
      id: index + 1,
      title: item.title,
      count: item.count,
    }));

    return formattedData;
  } catch (error) {
    console.error('채용 공고 수를 집계하는 데 실패했습니다:', error);
    return [];
  }
};