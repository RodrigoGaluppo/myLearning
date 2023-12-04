using Microsoft.AspNetCore.Mvc;
using DAL.Models;
using DAL.Global;
using DAL.Controllers.Request;
using Microsoft.EntityFrameworkCore;

namespace DAL.Controllers;

[ApiController]
[Route("[controller]")]
public class EmployeeController : ControllerBase
{
   
    public readonly myLearningContext dbContext;

    private readonly ILogger<EmployeeController> _logger;

    public EmployeeController(ILogger<EmployeeController> logger, myLearningContext dbContext)
    {
        _logger = logger;
        this.dbContext = dbContext;
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(string id)
    {

        try{
            
            if(id == null)
            {
                return BadRequest(ApplicationError.requiredParamtersNotSupplied);
            }
            
            var employeeExists = await dbContext.Employees.Select(
            o => new {
                o.Id,
                o.Name,      
                o.Email,
                o.EmployeeRole,
                o.Gender,
                o.BirthDate,
                o.CreatedAt,
                o.UpdatedAt
            }).FirstOrDefaultAsync(u => u.Id.ToString() == id);

            if(employeeExists == null)
            {
                return BadRequest(ApplicationError.notFound);
            }

            return Ok(employeeExists);
        }
        catch(Exception e){
           _logger.LogError(e.Message);
            return BadRequest(ApplicationError.appError);
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {

        try{
            
            if(id == null)
            {
                return BadRequest(ApplicationError.requiredParamtersNotSupplied);
            }
            
            var employeeExists = await dbContext.Employees.Select(
            o => new {
                o.Id,
                o.Name,      
                o.Email,
                o.EmployeeRole,
                o.Gender,
                o.BirthDate,
                o.CreatedAt,
                o.UpdatedAt
            }).FirstOrDefaultAsync(u => u.Id.ToString() == id);

            if(employeeExists == null)
            {
                return BadRequest(ApplicationError.notFound);
            }

            await dbContext.Employees.Where(u => u.Id.ToString() == id).ExecuteDeleteAsync();

            return Ok(employeeExists);
        }
        catch(Exception e){
           _logger.LogError(e.Message);
            return BadRequest(ApplicationError.appError);
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Edit([FromRoute] string id, [FromBody] EmployeeCreateRequest employeeCreateRequest)
    {

        try{
            if(id == null)
            {
                return BadRequest(ApplicationError.requiredParamtersNotSupplied);
            }
            
            var fieldsInUse = await dbContext.Employees
                .FirstOrDefaultAsync( u=> 
                (u.Email == employeeCreateRequest.Email) && u.Id.ToString() != id 
            ); // if he is trying to take an email that is already in use by someone thats not himself
           
            if(fieldsInUse != null){
                return BadRequest(ApplicationError.userExists);
            }

            await dbContext.Employees.Where(u => u.Id.ToString() == id)
            .ExecuteUpdateAsync(
                u=> u
                .SetProperty(u => u.Name,  u => employeeCreateRequest.Name)
                .SetProperty(u => u.EmployeeRole,  u => employeeCreateRequest.EmployeeRole)
                .SetProperty(u => u.BirthDate, u => DateOnly.FromDateTime(DateTime.Parse(employeeCreateRequest.BirthDate)))
                .SetProperty(u => u.Email, u => employeeCreateRequest.Email.ToLower())
                .SetProperty(u => u.Gender, u => employeeCreateRequest.Gender)
                .SetProperty(u => u.UpdatedAt, u => DateTime.Now)
            );
             

            var newEmployee = await dbContext.Employees.Select(
                o => new {
                    o.Id,
                    o.Name,
                    
                    o.Email,
                    o.Gender,
                    o.BirthDate,
                    o.EmployeeRole,
                    o.CreatedAt,
                    o.UpdatedAt
                }).FirstOrDefaultAsync(c=> c.Id.ToString() == id);
            return Ok(newEmployee);

        }
        catch(Exception e){
           _logger.LogError(e.Message);
            return BadRequest(ApplicationError.appError);
        }
    }

    

    [HttpGet("list")]
    public async Task<IActionResult> List([FromQuery] int page,[FromQuery] string? search="")
    {

        try{
            if(search == ""){
                var users = await dbContext.Employees.OrderBy(c=> c.CreatedAt).Skip((page - 1) * 10).Take(10).Select(
                o => new {
                    o.Id,
                    o.Name,
                    
                    o.Email,
                    o.Gender,
                    o.BirthDate,
                    
                    
                    o.CreatedAt,
                    o.UpdatedAt
                }
            ).ToListAsync();

            return Ok(new {
                employees=users,
                count= Math.Ceiling((await dbContext.Employees.CountAsync()) / 10.0)
            });
            }else{
                var users = await dbContext.Employees
                .OrderBy(c=> c.CreatedAt).Where(c=> c.Email.Trim().ToLower().Contains(search.Trim().ToLower()) )
                .Skip((page - 1) * 10).Take(10).Select(
                o => new {
                    o.Id,
                    o.Name,
                    
                    o.Email,
                    o.Gender,
                    o.BirthDate,
                    
                    
                    o.CreatedAt,
                    o.UpdatedAt
                }
            ).ToListAsync();

            return Ok(new {
                employees=users,
                count= Math.Ceiling((await dbContext.Employees.Where(c=> c.Email.Trim().ToLower().Contains(search.Trim().ToLower()) ).CountAsync()) / 10.0)
            });
            }
        }
        catch(Exception e){
           _logger.LogError(e.Message);
            return BadRequest(ApplicationError.appError);
        }
    }
   
    [HttpPost("login")]
    public async Task<IActionResult> Post([FromBody] CustomerLoginRequest customerLoginRequest)
    {
        try{
            var employeeExists = await dbContext.Employees.FirstOrDefaultAsync(u => u.Email == customerLoginRequest.Email);

            var employees = await dbContext.Employees.ToListAsync();

            employees.ForEach(e=>System.Console.WriteLine(e.Email));

            if(employeeExists == null){
                
                return BadRequest(ApplicationError.notFound);
            }

            if(!BCrypt.Net.BCrypt.Verify(customerLoginRequest.Password,employeeExists.Password,false,BCrypt.Net.HashType.SHA384))
            {
                return BadRequest(ApplicationError.notFound);
            }

           

            return Ok(new
            {
        
                employeeExists.Id,
                employeeExists.Name,
                employeeExists.Email,
                employeeExists.Gender,
                employeeExists.EmployeeRole,
                employeeExists.BirthDate,
                employeeExists.CreatedAt,
                employeeExists.UpdatedAt

            });

        }catch(Exception e){
           System.Console.WriteLine(e);
           _logger.LogError(e.Message);     
           return BadRequest(ApplicationError.appError);
        }

    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] EmployeeCreateRequest employeeCreateRequest)
    {
        try{
            var employeeExists = await dbContext.Employees
            .FirstOrDefaultAsync( u=> u.Email == employeeCreateRequest.Email );
        
            if(employeeExists != null){
                
                return BadRequest(ApplicationError.userExists);
            }

        
            dbContext.Add( new Employee{
                Name=employeeCreateRequest.Name.ToLower(),
       
                Email=employeeCreateRequest.Email.ToLower(),
                EmployeeRole=employeeCreateRequest.EmployeeRole,
                Password=BCrypt.Net.BCrypt.HashPassword(employeeCreateRequest.Password),
      
                BirthDate=DateOnly.FromDateTime(DateTime.Parse(employeeCreateRequest.BirthDate)),

                Gender=employeeCreateRequest.Gender
            });

            await dbContext.SaveChangesAsync();
             
            var customer = await dbContext.Employees.OrderBy(c=>c.CreatedAt).Select(
            o => new {
                o.Id,
                o.Name,
                
                o.Email,
                o.Gender,
                o.BirthDate,
                
                
                o.CreatedAt,
                o.UpdatedAt
            }).LastAsync();

            return Ok(customer);

        }catch(Exception e){
           _logger.LogError(e.Message);     
           return BadRequest(ApplicationError.appError);
        }

    }
}

