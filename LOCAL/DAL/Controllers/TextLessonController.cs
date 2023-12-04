using Microsoft.AspNetCore.Mvc;
using DAL.Models;
using DAL.Global;
using Microsoft.EntityFrameworkCore;

using DAL.Controllers.Request;
namespace DAL.Controllers;

[ApiController]
[Route("[controller]")]
public class TextLessonController : ControllerBase
{

    public readonly myLearningContext dbContext;

    private readonly ILogger<CustomerController> _logger;

    public TextLessonController(ILogger<CustomerController> logger, myLearningContext dbContext)
    {
        _logger = logger;
        this.dbContext = dbContext;
    }

    [HttpGet("list")]
    public async Task<IActionResult> List([FromQuery] int page)
    {

        try{
            var chapters = await dbContext.Textlessons.Skip((page - 1) * 10).OrderBy(c=> c.CreatedAt).Take(10).Select(
                c => new {
                c.Id,
                c.Content,
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
            
            var courseExists = await dbContext.Textlessons.Select(
            c => new {
                c.Id,
                c.Content,
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
            
            
            await dbContext.Textlessons.Where(c => c.Id.ToString() == id)
            .ExecuteDeleteAsync();
            

            return Ok();
        }
        catch(Exception e){
           _logger.LogError(e.Message);
            return BadRequest(ApplicationError.appError);
        }
    }


    [HttpPut("{id}")]
    public async Task<IActionResult> Put([FromRoute] string id ,[FromBody] TextLessonCreateRequest textLessonCreateRequest)
    {
        try{
            
            if(id == null)
            {
                return BadRequest(ApplicationError.requiredParamtersNotSupplied);
            }
            
            
            await dbContext.Textlessons.Where(c => c.Id.ToString() == id)
            .ExecuteUpdateAsync(
                c=> c
                .SetProperty(c=> c.Title, c => textLessonCreateRequest.Title)
                .SetProperty(c=> c.Content, c => textLessonCreateRequest.Content)
                .SetProperty(c=> c.LessonId, c => textLessonCreateRequest.LessonId)
                .SetProperty(c => c.UpdatedAt, c => DateTime.Now)
            );

            var courseExists = await dbContext.Textlessons.Select(
            c => new {
                c.Id,
                c.Content,
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
    public async Task<IActionResult> Post([FromBody] TextLessonCreateRequest textLessonCreateRequest)
    {
        try{
            
            await dbContext.Textlessons
            .AddAsync(
                new Textlesson{
                    Title=textLessonCreateRequest.Title,
                    Content=textLessonCreateRequest.Content,
                    LessonId=textLessonCreateRequest.LessonId,
                    
                }
            );
            
            await dbContext.SaveChangesAsync();

            var Lastcourse  = await dbContext.Textlessons.Select(
            c => new {
                c.Id,
                c.Content,
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
