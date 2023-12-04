using Microsoft.AspNetCore.Mvc;
using DAL.Models;
using DAL.Global;
using Microsoft.EntityFrameworkCore;

using DAL.Controllers.Request;
namespace DAL.Controllers;

[ApiController]
[Route("[controller]")]
public class LessonController : ControllerBase
{

    public readonly myLearningContext dbContext;

    private readonly ILogger<CustomerController> _logger;

    public LessonController(ILogger<CustomerController> logger, myLearningContext dbContext)
    {
        _logger = logger;
        this.dbContext = dbContext;
    }

    [HttpGet("/GetLessonCountByCourseId")]
    public async Task<IActionResult> GetLessonCountByCourseId( [FromQuery] string courseId)
    {
        try{
            
            if( courseId == null)
            {
                return BadRequest(ApplicationError.requiredParamtersNotSupplied);
            }
            
            var sum = dbContext.Chapters.Where(c=> c.CourseId.ToString() == courseId).Include(c=> c.Lessons).Sum(c=> c.Lessons.Count());

            return Ok(new {
                sum
            });
        }
        catch(Exception e){
           _logger.LogError(e.Message);
            return BadRequest(ApplicationError.appError);
        }
    }

    [HttpGet("list/{chapterId}")]
    public async Task<IActionResult> List([FromQuery] int page, [FromRoute] int chapterId)
    {

        try{
            var lessons = await dbContext.Lessons
            .Where(l=> l.ChapterId == chapterId)
            .Skip((page - 1) * 10)
            .OrderBy(c=> c.CreatedAt)
            .Take(10)
            .Select(
                c => new {
                c.Id,
                c.Description,
                c.Title,
                c.ChapterId,
                c.CreatedAt,
                c.UpdatedAt
            }
            ).ToListAsync();

            return Ok(new{
                lessons,
                count=Math.Ceiling((await dbContext.Lessons
            .Where(l=> l.ChapterId == chapterId).CountAsync()) / 10.0)
            });
        }
        catch(Exception e){
           _logger.LogError(e.Message);
            return BadRequest(ApplicationError.appError);
        }
    }

    [HttpGet("list")]
    public async Task<IActionResult> List([FromQuery] int page)
    {

        try{
            var lessons = await dbContext.Lessons.Skip((page - 1) * 10).OrderBy(c=> c.CreatedAt).Take(10).Select(
                c => new {
                c.Id,
                c.Description,
                c.Title,
                c.ChapterId,
                c.CreatedAt,
                c.UpdatedAt
            }
            ).ToListAsync();

            return Ok(lessons);
        }
        catch(Exception e){
           _logger.LogError(e.Message);
            return BadRequest(ApplicationError.appError);
        }
    }

     

    [HttpGet("{id}")]
    public async Task<IActionResult> Get([FromRoute] string id, [FromQuery] string? customerId="")
    {
        
        try{
             
            if(id == null)
            {
                return BadRequest(ApplicationError.requiredParamtersNotSupplied);
            }

            if(customerId != null) {

            var lessonsExists = await dbContext.Lessons.Select(
            c => new {
                c.Id,
                c.Description,
                c.Title,
                c.ChapterId,
                c.CreatedAt,
                c.UpdatedAt
            }).FirstOrDefaultAsync(c => c.Id.ToString() == id);

            if(lessonsExists == null)
            {
                return BadRequest(ApplicationError.notFound);
            }

            var videolessons = dbContext.Videolessons
            .OrderBy(c=> c.CreatedAt)
            .Where(v=> v.LessonId == lessonsExists.Id)
            .ToList();

            var textLessons = dbContext.Textlessons
            .OrderBy(c=> c.CreatedAt)
            .Where(v=> v.LessonId == lessonsExists.Id)
            .ToList();

            var resourceLessons = dbContext.Resourcelessons
            .OrderBy(c=> c.CreatedAt)
            .Where(v=> v.LessonId == lessonsExists.Id)
            .ToList();

            var isAccomplished = dbContext.Accomplishedlessons.FirstOrDefault(a=> a.CustomerId.ToString() == customerId && a.LessonId.ToString() == id);


            return Ok(new {
                Id=lessonsExists.Id,
                Description=lessonsExists.Description,
                ChapterId = lessonsExists.ChapterId,
                Title=lessonsExists.Title,
                CreatedAt=lessonsExists.CreatedAt,
                UpdatedAt=lessonsExists.UpdatedAt,
                videolessons,
                textLessons,
                resourceLessons,
                isAccomplished = (isAccomplished != null)
            });

            }else{
                var lessonsExists = await dbContext.Lessons.Select(
            c => new {
                c.Id,
                c.Description,
                c.Title,
                c.ChapterId,
                c.CreatedAt,
                c.UpdatedAt
            }).FirstOrDefaultAsync(c => c.Id.ToString() == id);

            if(lessonsExists == null)
            {
                return BadRequest(ApplicationError.notFound);
            }

            var videolessons = dbContext.Videolessons
            .OrderBy(c=> c.CreatedAt)
            .Where(v=> v.LessonId == lessonsExists.Id)
            .ToList();

            var textLessons = dbContext.Textlessons
            .OrderBy(c=> c.CreatedAt)
            .Where(v=> v.LessonId == lessonsExists.Id)
            .ToList();

            var resourceLessons = dbContext.Resourcelessons
            .OrderBy(c=> c.CreatedAt)
            .Where(v=> v.LessonId == lessonsExists.Id)
            .ToList();

            return Ok(new {
                Id=lessonsExists.Id,
                Description=lessonsExists.Description,
                ChapterId = lessonsExists.ChapterId,
                Title=lessonsExists.Title,
                CreatedAt=lessonsExists.CreatedAt,
                UpdatedAt=lessonsExists.UpdatedAt,
                videolessons,
                textLessons,
                resourceLessons
            });
            }
        }
        catch(Exception e){
           _logger.LogError(e.Message);
            return BadRequest(ApplicationError.appError);
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete([FromRoute] string id )
    {
        try{
            
            if(id == null)
            {
                return BadRequest(ApplicationError.requiredParamtersNotSupplied);
            }
            
            
            await dbContext.Lessons.Where(c => c.Id.ToString() == id)
            .ExecuteDeleteAsync();
            

            return Ok();
        }
        catch(Exception e){
           _logger.LogError(e.Message);
            return BadRequest(ApplicationError.appError);
        }
    }


    [HttpPut("{id}")]
    public async Task<IActionResult> Put([FromRoute] string id ,[FromBody] LessonUpdateRequest lessonCreateRequest)
    {
        try{
            
            if(id == null)
            {
                return BadRequest(ApplicationError.requiredParamtersNotSupplied);
            }
            
            
            await dbContext.Lessons.Where(c => c.Id.ToString() == id)
            .ExecuteUpdateAsync(
                c=> c
                .SetProperty(c=> c.Title, c => lessonCreateRequest.Title)
                .SetProperty(c=> c.Description, c => lessonCreateRequest.Description)
                .SetProperty(c => c.UpdatedAt, c => DateTime.Now)
            );

            var lessonsExists = await dbContext.Lessons.Select(
            c => new {
                c.Id,
                c.Description,
                c.Title,
                c.ChapterId,
                c.CreatedAt,
                c.UpdatedAt
            }).FirstOrDefaultAsync(c => c.Id.ToString() == id);

            if(lessonsExists == null)
            {
                return BadRequest(ApplicationError.notFound);
            }

            return Ok(lessonsExists);
        }
        catch(Exception e){
           _logger.LogError(e.Message);
            return BadRequest(ApplicationError.appError);
        }
    }

    [HttpPost()]
    public async Task<IActionResult> Post([FromBody] LessonCreateRequest lessonCreateRequest)
    {
        try{
            
            await dbContext.Lessons
            .AddAsync(
                new Lesson{
                    Title=lessonCreateRequest.Title,
                    Description=lessonCreateRequest.Description,
                    ChapterId=lessonCreateRequest.ChapterId,
                }
            );
            
            await dbContext.SaveChangesAsync();

            var Lastcourse  = await dbContext.Lessons.Select(
            c => new {
                c.Id,
                c.Description,
                c.Title,
                c.ChapterId,
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
