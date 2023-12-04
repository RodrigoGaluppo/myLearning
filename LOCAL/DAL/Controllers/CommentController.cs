using Microsoft.AspNetCore.Mvc;
using DAL.Models;
using DAL.Global;
using Microsoft.EntityFrameworkCore;

using DAL.Controllers.Request;
namespace DAL.Controllers;

[ApiController]
[Route("[controller]")]
public class CommentController : ControllerBase
{

    public readonly myLearningContext dbContext;

    private readonly ILogger<CustomerController> _logger;

    public CommentController(ILogger<CustomerController> logger, myLearningContext dbContext)
    {
        _logger = logger;
        this.dbContext = dbContext;
    }

    [HttpGet("list")]
    public async Task<IActionResult> List([FromQuery] int page)
    {

        try{
            var chapters = await dbContext.Comments.Skip((page - 1) * 10).OrderBy(c=> c.CreatedAt).Take(10).Select(
                c => new {
                c.Id,
                c.QuestionId,
                c.CustomerId,
                c.Content,
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
            
            var comment = await dbContext.Comments.Select(
            c => new {
                c.Id,
                c.QuestionId,
                c.CustomerId,
                c.Content,
                c.CreatedAt,
                c.UpdatedAt
            }).FirstOrDefaultAsync(c=> c.Id.ToString() == id);

            if(comment == null)
            {
                return BadRequest(ApplicationError.notFound);
            }

            return Ok(comment);
        }
        catch(Exception e){
           _logger.LogError(e.Message);
            return BadRequest(ApplicationError.appError);
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete([FromRoute] string id)
    {
        try{
            
            if(id == null)
            {
                return BadRequest(ApplicationError.requiredParamtersNotSupplied);
            }
            
            
            await dbContext.Comments.Where(c=> c.Id.ToString() == id)
            .ExecuteDeleteAsync();
            

            return Ok();
        }
        catch(Exception e){
           _logger.LogError(e.Message);
            return BadRequest(ApplicationError.appError);
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put([FromRoute] string id,[FromBody] CommentCreateRequest commentCreateRequest)
    {
        try{
            
            if(id == null)
            {
                return BadRequest(ApplicationError.requiredParamtersNotSupplied);
            }
            
            await dbContext.Comments.Where(c=> c.Id.ToString() == id)
            .ExecuteUpdateAsync(
                c=> c
                
                .SetProperty(c => c.Content,  c => commentCreateRequest.Content)
                .SetProperty(c => c.UpdatedAt, c => DateTime.Now)
            );

            var subjectExists = await dbContext.Comments.Select(
            c => new {
                    c.Id,
                    c.CustomerId,
                    c.QuestionId,
                    c.Content,
                    c.CreatedAt,
                    c.UpdatedAt
                }).FirstOrDefaultAsync(c=> c.Id.ToString() == id);

            if(subjectExists == null)
            {
                return BadRequest(ApplicationError.notFound);
            }

            return Ok(subjectExists);
        }
        catch(Exception e){
           _logger.LogError(e.Message);
            return BadRequest(ApplicationError.appError);
        }
    }


    [HttpPost()]
    public async Task<IActionResult> Post([FromBody] CommentCreateRequest questionCreat6eRequest)
    {
        try{
            
            await dbContext.Comments
            .AddAsync(
                new Comment{
                    CustomerId=questionCreat6eRequest.CustomerId,
                    QuestionId=questionCreat6eRequest.QuestionId,
                    Content=questionCreat6eRequest.Content
                }
            );
            
            await dbContext.SaveChangesAsync();

            var comment  = await dbContext.Comments.Select(
            c => new {
                c.Id,
                c.QuestionId,
                c.CustomerId,
                c.Content,
                c.CreatedAt,
                c.UpdatedAt
            }).OrderByDescending(c=>c.CreatedAt).LastAsync();
 
            return Ok(comment);
        }
        catch(Exception e){
           _logger.LogError(e.Message);
            return BadRequest(ApplicationError.appError);
        }
    }
}
