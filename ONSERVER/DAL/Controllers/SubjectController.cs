using Microsoft.AspNetCore.Mvc;
using DAL.Models;
using DAL.Global;
using Microsoft.EntityFrameworkCore;

using DAL.Controllers.Request;
namespace DAL.Controllers;

[ApiController]
[Route("[controller]")]
public class SubjectController : ControllerBase
{

    public readonly myLearningContext dbContext;

    private readonly ILogger<CustomerController> _logger;

    public SubjectController(ILogger<CustomerController> logger, myLearningContext dbContext)
    {
        _logger = logger;
        this.dbContext = dbContext;
    }


    [HttpGet("{id}")]
    public async Task<IActionResult> Get([FromRoute] string id)
    {
        try{
            
            if(id == null)
            {
                return BadRequest(ApplicationError.requiredParamtersNotSupplied);
            }
            
            var subjectExists = await dbContext.Subjects.Select(
            c => new {
                c.Id,
                Name=c.Name,
                c.CreatedAt,
                c.UpdatedAt
            }).FirstOrDefaultAsync(c => c.Id.ToString() == id);

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

    [HttpGet("list")]
    public async Task<IActionResult> List([FromQuery] int page, [FromQuery] string? search)
    {

        try{
            if(search == null){
                var subjects = await dbContext.Subjects.OrderBy(c=> c.CreatedAt).Skip((page - 1) * 2).Take(2).Select(
                    o => new {
                        o.Id,
                        Name=o.Name,
                        o.CreatedAt,
                        o.UpdatedAt
                    }
                ).ToListAsync();

                return Ok(new {
                    subjects,
                    count= (await dbContext.Subjects.CountAsync())
                });
            }
            else{
                var subjects = await dbContext.Subjects.OrderBy(c=> c.CreatedAt).Where(c=> c.Name.Trim().ToLower().Contains(search.Trim().ToLower()))
                .Skip((page - 1) * 2).Take(2).Select(
                    o => new {
                        o.Id,
                        Name=o.Name,
                        o.CreatedAt,
                        o.UpdatedAt
                    }
                ).ToListAsync();

                return Ok(new {
                    subjects,
                    count= (await dbContext.Subjects.Where(c=> c.Name.Trim().ToLower().Contains(search.Trim().ToLower())).CountAsync())
                });
            }
            
        }
        catch(Exception e){
           _logger.LogError(e.Message);
           System.Console.WriteLine(e.Message);
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
            
            await dbContext.Subjects.Where(c => c.Id.ToString() == id)
            .ExecuteDeleteAsync();

            return Ok();
        }
        catch(Exception e){
           _logger.LogError(e.Message);
            return BadRequest(ApplicationError.appError);
        }
    }


    [HttpPut("{id}")]
    public async Task<IActionResult> Put([FromRoute] string id ,[FromBody] SubjectCreateRequest subjectCreateRequest)
    {
        try{
            
            if(id == null)
            {
                return BadRequest(ApplicationError.requiredParamtersNotSupplied);
            }
            
            
            await dbContext.Subjects.Where(c => c.Id.ToString() == id)
            .ExecuteUpdateAsync(
                c=> c
                .SetProperty(c => c.Name,  c => subjectCreateRequest.Name)
                .SetProperty(c => c.UpdatedAt, c => DateTime.Now)
            );

            var subjectExists = await dbContext.Subjects.Select(
            c => new {
                c.Id,
                Name = c.Name,
                c.CreatedAt,
                c.UpdatedAt
            }).FirstOrDefaultAsync(c => c.Id.ToString() == id);

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
    public async Task<IActionResult> Post([FromBody] SubjectCreateRequest subjectCreateRequest)
    {
        try{
            
            await dbContext.Subjects
            .AddAsync(
                new Subject{
                    Name= subjectCreateRequest.Name
                }
            );
            
            await dbContext.SaveChangesAsync();

            var Lastcourse  = await dbContext.Subjects.Select(
            c => new {
                c.Id,
                Name=c.Name,
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
