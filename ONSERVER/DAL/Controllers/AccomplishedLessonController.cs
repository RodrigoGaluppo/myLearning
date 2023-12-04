using Microsoft.AspNetCore.Mvc;
using DAL.Models;
using DAL.Global;
using Microsoft.EntityFrameworkCore;

using DAL.Controllers.Request;
namespace DAL.Controllers;

[ApiController]
[Route("[controller]")]
public class AccomplisehdLessonController : ControllerBase
{

    public readonly myLearningContext dbContext;

    private readonly ILogger<CustomerController> _logger;

    public AccomplisehdLessonController(ILogger<CustomerController> logger, myLearningContext dbContext)
    {
        _logger = logger;
        this.dbContext = dbContext;
    }

    [HttpGet("listAccomplishedLesson")]
    public async Task<IActionResult> listAccomplishedLesson([FromQuery] string customerId, [FromQuery] int courseId)
    {
        
        try{
            var accomplishedLessonsCountCounting = await dbContext.Accomplishedlessons
            .Include(o=> o.Lesson)
                .ThenInclude(o=> o.Chapter)
                    .ThenInclude(o=> o.Course)
            .Where(c=> c.CustomerId.ToString() == customerId && c.Lesson.Chapter.Course.Id == courseId)
            .CountAsync();

            var lessonsCount = await dbContext.Lessons
                .Include(l=> l.Chapter)
                    .ThenInclude(l=> l.Course)
                        .Where(l=> l.Chapter.Course.Id == courseId).CountAsync();


            
            return Ok(new {
                lessonsCount,
                accomplishedLessonsCount=(accomplishedLessonsCountCounting/Convert.ToDouble(lessonsCount))
            });
        }
        catch(Exception e){
        
           _logger.LogError(e.Message);
            return BadRequest(ApplicationError.appError);
        }
    }


    [HttpGet("{customer_id}/{lesson_id}")]
    public async Task<IActionResult> Get([FromRoute] string customer_id, [FromRoute] string lesson_id)
    {
        try{
            
            if(customer_id == null || lesson_id == null)
            {
                return BadRequest(ApplicationError.requiredParamtersNotSupplied);
            }
            
            var accomplishedLesson = await dbContext.Accomplishedlessons.Select(
            c => new {
                c.CustomerId,
                c.LessonId,
                c.CreatedAt,
                c.UpdatedAt
            }).FirstOrDefaultAsync(c => c.CustomerId.ToString() == customer_id && c.LessonId.ToString() == lesson_id);

            if(accomplishedLesson == null)
            {
                return BadRequest(ApplicationError.notFound);
            }

            return Ok(accomplishedLesson);
        }
        catch(Exception e){
           _logger.LogError(e.Message);
            return BadRequest(ApplicationError.appError);
        }
    }

    [HttpDelete("{customer_id}/{lesson_id}")]
    public async Task<IActionResult> Delete([FromRoute] string customer_id, [FromRoute] string lesson_id)
    {
        try{
            
            if(customer_id == null || lesson_id == null)
            {
                return BadRequest(ApplicationError.requiredParamtersNotSupplied);
            }
            
            
            await dbContext.Accomplishedlessons.Where(c => c.CustomerId.ToString() == customer_id && c.LessonId.ToString() == lesson_id)
            .ExecuteDeleteAsync();
            

            return Ok();
        }
        catch(Exception e){
           _logger.LogError(e.Message);
            return BadRequest(ApplicationError.appError);
        }
    }


    [HttpPost()]
    public async Task<IActionResult> Post([FromBody] AccomplishedLessonCreateRequest accomplishedLessonCreateRequest)
    {
        try{
            
            await dbContext.Accomplishedlessons
            .AddAsync(
                new Accomplishedlesson{
                    CustomerId=accomplishedLessonCreateRequest.CustomerId,
                    LessonId=accomplishedLessonCreateRequest.LessonId
               
                }
            );
            
            await dbContext.SaveChangesAsync();

            var Lastcourse  = await dbContext.Accomplishedlessons.Select(
            c => new {
                c.CustomerId,
                c.LessonId,
                c.CreatedAt,
                c.UpdatedAt
            }).OrderBy(c=>c.CreatedAt).LastAsync();
 
            return Ok(Lastcourse);
        }
        catch(Exception e){
           _logger.LogError(e.Message);
            return BadRequest(ApplicationError.appError);
        }
    }
}
