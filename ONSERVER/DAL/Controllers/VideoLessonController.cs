using Microsoft.AspNetCore.Mvc;
using DAL.Models;
using DAL.Global;
using Microsoft.EntityFrameworkCore;

using DAL.Controllers.Request;
namespace DAL.Controllers;

[ApiController]
[Route("[controller]")]
public class VideoLessonController : ControllerBase
{

    public readonly myLearningContext dbContext;

    private readonly ILogger<CustomerController> _logger;

    public VideoLessonController(ILogger<CustomerController> logger, myLearningContext dbContext)
    {
        _logger = logger;
        this.dbContext = dbContext;
    }

    [HttpGet("list")]
    public async Task<IActionResult> List([FromQuery] int page)
    {

        try{
            var chapters = await dbContext.Videolessons.Skip((page - 1) * 10).OrderBy(c=> c.CreatedAt).Take(10).Select(
                c => new {
                c.Id,
                c.Url,
                c.Title,
                c.LessonId,
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
            
            var courseExists = await dbContext.Videolessons.Select(
            c => new {
                c.Id,
                c.Url,
                c.Title,
                c.LessonId,
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
            
            
            await dbContext.Videolessons.Where(c => c.Id.ToString() == id)
            .ExecuteDeleteAsync();
            

            return Ok();
        }
        catch(Exception e){
           _logger.LogError(e.Message);
            return BadRequest(ApplicationError.appError);
        }
    }



    [HttpPut("/VideoLesson/Video/{id}")]
    public async Task<IActionResult> ChangeVideo([FromRoute] string id ,[FromBody] ChangeVideoLessonVideo videoLessonVideo)
    {
        try{
            
            if(id == null)
            {
                return BadRequest(ApplicationError.requiredParamtersNotSupplied);
            }
            
            
            await dbContext.Videolessons.Where(c => c.Id.ToString() == id)
            .ExecuteUpdateAsync(
                c=> c
                .SetProperty(c=> c.Url, c => videoLessonVideo.Url)
                .SetProperty(c => c.UpdatedAt, c => DateTime.Now)
            );

            var VideoLessonExists = await dbContext.Videolessons.Select(
            c => new {
                c.Id,
                c.Url,
                c.Title,
                c.LessonId,
                c.CreatedAt,
                c.UpdatedAt
            }).FirstOrDefaultAsync(c => c.Id.ToString() == id);

            if(VideoLessonExists == null)
            {
                return BadRequest(ApplicationError.notFound);
            }

            return Ok(VideoLessonExists);
        }
        catch(Exception e){
           _logger.LogError(e.Message);
            return BadRequest(ApplicationError.appError);
        }
    }


    [HttpPut("{id}")]
    public async Task<IActionResult> Put([FromRoute] string id ,[FromBody] VideoLessonCreateRequest videoLessonCreateRequest)
    {
        try{
            
            if(id == null)
            {
                return BadRequest(ApplicationError.requiredParamtersNotSupplied);
            }
            
            
            await dbContext.Videolessons.Where(c => c.Id.ToString() == id)
            .ExecuteUpdateAsync(
                c=> c
                .SetProperty(c=> c.Title, c => videoLessonCreateRequest.Title)
                .SetProperty(c=> c.Url, c => videoLessonCreateRequest.Url)
                .SetProperty(c=> c.LessonId, c => videoLessonCreateRequest.LessonId)
                .SetProperty(c => c.UpdatedAt, c => DateTime.Now)
            );

            var courseExists = await dbContext.Videolessons.Select(
            c => new {
                c.Id,
                c.Url,
                c.Title,
                c.LessonId,
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
    public async Task<IActionResult> Post([FromBody] VideoLessonCreateRequest videoLessonCreateRequest)
    {
        try{
            
            await dbContext.Videolessons
            .AddAsync(
                new Videolesson{
                    Title=videoLessonCreateRequest.Title,
                    Url=videoLessonCreateRequest.Url,
                    LessonId=videoLessonCreateRequest.LessonId,
                    
                }
            );
            
            await dbContext.SaveChangesAsync();

            var Lastcourse  = await dbContext.Videolessons.Select(
            c => new {
                c.Id,
                c.Url,
                c.Title,
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
