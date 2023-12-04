using Microsoft.AspNetCore.Mvc;
using DAL.Models;
using DAL.Global;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("[controller]")]
public class DataController : ControllerBase
{

    public readonly myLearningContext dbContext;

    private readonly ILogger<DataController> _logger;

    public DataController(ILogger<DataController> logger, myLearningContext dbContext)
    {
        _logger = logger;
        this.dbContext = dbContext;
    }

    [HttpGet()]
    public async Task<IActionResult> Get ()
    {
        try{
            var totalCustomers = await dbContext.Customers.CountAsync();
            var totalEmployees = await dbContext.Employees.CountAsync();

            // get accomplishedLesosns by month

            var accomplishedLessonsByMonth = dbContext.Accomplishedlessons
                .GroupBy(al => al.CreatedAt.Value.Month)
                .ToDictionary(g => g.Key, g => g.Count());

            // Set count to 0 for missing months
                for (int month = 1; month <= 12; month++)
                {
                    if (!accomplishedLessonsByMonth.ContainsKey(month))
                    {
                        accomplishedLessonsByMonth[month] = 0;
                    }
                }

                var accomplishedLessonsByHour = dbContext.Accomplishedlessons
                .GroupBy(al => al.CreatedAt.Value.Hour)
                .ToDictionary(g => g.Key, g => g.Count());

                    // Set count to 0 for missing hours
                    for (int hour = 0; hour < 24; hour++)
                    {
                        if (!accomplishedLessonsByHour.ContainsKey(hour))
                        {
                            accomplishedLessonsByHour[hour] = 0;
                        }
                    }

                // Convert 0-23 to 1-12 AM/PM format
                var accomplishedLessonsByHourAMPM = new Dictionary<string, int>();
                foreach (var kvp in accomplishedLessonsByHour)
                {
                    int hourAMPM = kvp.Key % 12;
                    if (hourAMPM == 0)
                    {
                        hourAMPM = 12;
                    }
                    string period = (kvp.Key >= 12) ? "PM" : "AM";
                    string key = $"{hourAMPM} {period}";

                    accomplishedLessonsByHourAMPM[key] = kvp.Value;
                }

            
                // gender percentage customers
                var genderPercentages = dbContext.Customers
                .GroupBy(c => c.Gender)
                .Select(g => new
                {
                    Gender = g.Key,
                    Percentage = Math.Round((g.Count() / (double)totalCustomers) * 100,0)
                })
                .ToList();

                var genderPercentagesEmployees = dbContext.Employees
                .GroupBy(c => c.Gender)
                .Select(g => new
                {
                    Gender = g.Key,
                    Percentage = Math.Round((g.Count() / Convert.ToDouble(totalEmployees)) * 100,0)
                })
                .ToList();

                 var rolePercentageEmployee = dbContext.Employees
                .GroupBy(e => e.EmployeeRole)
                .Select(g => new
                {
                    Role = g.Key,
                    Percentage = Math.Round((g.Count() / (double)dbContext.Employees.Count()) * 100)
                })
                .ToList();

                // list of courses with most subscribers
                var topCourses = dbContext.Courses
                .OrderByDescending(c => c.Customercourses.Count)
                .Take(5)
                .Select(c => new { CourseName = c.Name, EnrollmentCount = c.Customercourses.Count })
                .ToList();


            return Ok(new {
                coursesCount = await dbContext.Courses.CountAsync(),
                customersCount = totalCustomers,
                lessonsCount = await dbContext.Lessons.CountAsync(),
                genderPercentages,
                genderPercentagesEmployees,
                accomplishedLessonsByMonth,
                accomplishedLessonsByHour,
                rolePercentageEmployee,
                topCourses
            });
        }
        catch(Exception e){
            System.Console.WriteLine(e);
           _logger.LogError(e.Message);
            return BadRequest(ApplicationError.appError);
        }
    }
}