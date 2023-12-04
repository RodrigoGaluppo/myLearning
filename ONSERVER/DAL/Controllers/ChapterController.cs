using Microsoft.AspNetCore.Mvc;
using DAL.Models;
using DAL.Global;
using Microsoft.EntityFrameworkCore;

using DAL.Controllers.Request;
namespace DAL.Controllers;

[ApiController]
[Route("[controller]")]
public class ChapterController : ControllerBase
{

    public readonly myLearningContext dbContext;

    private readonly ILogger<CustomerController> _logger;

    public ChapterController(ILogger<CustomerController> logger, myLearningContext dbContext)
    {
        _logger = logger;
        this.dbContext = dbContext;
    }

    [HttpGet("ListByCourseId/{courseId}")]

    public async Task<IActionResult> ListByCourseId([FromQuery] int page, [FromRoute] int courseId)
    {

        try{
            var chapters = await dbContext.Chapters
            .OrderBy(c=> c.CreatedAt)
            .Include(c=> c.Lessons)
            .Where(c => c.CourseId == courseId)
            .Skip((page - 1) * 10)
            .Take(10)
            .Select(
                c => new {
                c.Id,
                c.Title,
                c.CourseId,
                c.Lessons,
                c.CreatedAt,
                c.UpdatedAt
            }
            ).ToListAsync();

            return Ok(new {
                chapters,
                count = Math.Ceiling((await dbContext.Chapters.OrderBy(c=> c.CreatedAt).Where(c => c.CourseId == courseId).CountAsync()) / 10.0)
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
            var chapters = await dbContext.Chapters.Skip((page - 1) * 10).OrderBy(c=> c.CreatedAt).Take(10).Select(
                c => new {
                c.Id,
                c.Title,
                c.CourseId,
                c.CreatedAt,
                c.UpdatedAt
            }
            ).ToListAsync();

            return Ok(chapters);
        }
        catch(Exception e){
           _logger.LogError(e.Message);
            return BadRequest(ApplicationError.appError);
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Get([FromRoute] string id)
    {
        try{
            
            if(id == null)
            {
                return BadRequest(ApplicationError.requiredParamtersNotSupplied);
            }
            
            var courseExists = await dbContext.Chapters
            .Include(c=>c.Lessons)
            .Select(
            c => new {
                c.Id,
                c.Title,
                c.CourseId,
                lessons=c.Lessons,
                c.CreatedAt,
                c.UpdatedAt
            }).FirstOrDefaultAsync(c => c.Id.ToString() == id);

            if(courseExists == null)
            {
                return BadRequest(ApplicationError.notFound);
            }

            return Ok(courseExists);
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
            
            
            await dbContext.Chapters.Where(c => c.Id.ToString() == id)
            .ExecuteDeleteAsync();
            

            return Ok();
        }
        catch(Exception e){
           _logger.LogError(e.Message);
            return BadRequest(ApplicationError.appError);
        }
    }


    [HttpPut("{id}")]
    public async Task<IActionResult> Put([FromRoute] string id ,[FromBody] ChapterUpdateRequest chapterCreateRequest)
    {
        try{
            
            if(id == null)
            {
                return BadRequest(ApplicationError.requiredParamtersNotSupplied);
            }
            
            
            await dbContext.Chapters.Where(c => c.Id.ToString() == id)
            .ExecuteUpdateAsync(
                c=> c
                .SetProperty(c=> c.Title, c => chapterCreateRequest.Title)
                .SetProperty(c => c.UpdatedAt, c => DateTime.Now)
            );

            var courseExists = await dbContext.Chapters.Select(
            c => new {
                c.Id,
                c.Title,
                c.CourseId,
                c.CreatedAt,
                c.UpdatedAt
            }).FirstOrDefaultAsync(c => c.Id.ToString() == id);

            if(courseExists == null)
            {
                return BadRequest(ApplicationError.notFound);
            }

            return Ok(courseExists);
        }
        catch(Exception e){
           _logger.LogError(e.Message);
            return BadRequest(ApplicationError.appError);
        }
    }

    [HttpPost()]
    public async Task<IActionResult> Post([FromBody] ChapterCreateRequest chapterCreateRequest)
    {
        try{
            
            await dbContext.Chapters
            .AddAsync(
                new Chapter{
                    Title=chapterCreateRequest.Title,
                    CourseId=chapterCreateRequest.CourseId,
                }
            );
            
            await dbContext.SaveChangesAsync();

            var Lastcourse  = await dbContext.Chapters.Select(
            c => new {
                c.Id,
                c.Title,
                c.CourseId,
         
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
