import Role from "../models/Role.js";
import Permission from "../models/Permission.js";
// Fetch all roles
export const getRoles = async (req, res) => {
  try {
    const roles = await Role.findAll();
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ message: "Error fetching roles", error });
  }
};
// Create a new role
export const createRole = async (req, res) => {
  const { name } = req.body;
  try {
    const newRole = await Role.create({ name });
    res.status(201).json(newRole);
  } catch (error) {
    res.status(500).json({ message: "Error creating role", error });
  }
};
// Update an existing role
export const updateRole = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const role = await Role.findByPk(id);
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }
    role.name = name;
    await role.save();
    res.status(200).json(role);
  } catch (error) {
    res.status(500).json({ message: "Error updating role", error });
  }
};

// Delete a role
export const deleteRole = async (req, res) => {
  const { id } = req.params;
  try {
    const role = await Role.findByPk(id);
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }
    await role.destroy();
    res.status(200).json({ message: "Role deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting role", error });
  }
};


export const getPermissionsByRole = async (req, res) => {
  try {
    const { roleId } = req.params;
    const permissions = await Permission.findAll({ where: { roleId } });
    res.status(200).json(permissions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching permissions", error: error.message });
  }
};

// Update permissions for a role
export const updatePermissions = async (req, res) => {
  try {
    const { selectedRole, updatedPermissions } = req.body;
    const roleId = selectedRole;
    
    if (!updatedPermissions || updatedPermissions.length === 0) {
      return res.status(400).json({ message: "No permissions provided" });
    }

    const updatePromises = updatedPermissions.map((perm) => {
      const isGranted = perm.isGranted !== undefined ? perm.isGranted : false;
      
      console.log('Updating Permission:', { permissionId: perm.id, roleId, isGranted });

      // Ensure the permission id is a valid number
      const permissionId = Number(perm.id);
      if (isNaN(permissionId)) {
        console.error(`Invalid permission ID: ${perm.id}`);
        return null; // Skip if invalid
      }

      // Log the query parameters for debugging
      console.log('Where clause:', { roleId, id: permissionId });

      // Update the permission in the database
      return Permission.update(
        { isGranted },
        { where: { roleId, id: permissionId } }
      );
    });

    // Wait for all the update operations to complete
    await Promise.all(updatePromises);

    res.status(200).json({ message: "Permissions updated successfully" });
  } catch (error) {
    console.error('Error updating permissions:', error);
    res.status(500).json({ message: "Error updating permissions", error: error.message });
  }
};


const defaultPermissions = [
  "Roles",
  "Permissions",
  "Farmer List",
  "Farmer Edit",
  "Farmer Delete",
  "SAAO List",
  "SAAO Edit",
  "SAAO Delete",
  "UAO List",
  "UAO Edit",
  "UAO Delete",
  "DD List",
  "DD Edit",
  "DD Delete",
  "AD List",
  "AD Edit",
  "AD Delete",
  "Journalist List",
  "Journalist Edit",
  "Journalist Delete",
  "Scientist List",
  "Scientist Edit",
  "Scientist Delete",
  "Diseases List",
  "Diseases Edit",
  "Diseases Delete",
  "Report",
  "Feedback",
  "Send Feedback",
  "Feedback Table",
  "Add Block",
  "Add Union",
  "Add Upazela",
  "Add District",
  "Add Division",
  "Add Region",
  "Add Hotspot",
  "Add User",
  "Change Password",
  "Profile",
];

export const syncAllRolePermissions = async (req, res) => {
  try {
    const roles = await Role.findAll();

    for (const role of roles) {
      const existingPermissions = await Permission.findAll({
        where: { roleId: role.id },
      });

      const existingPermissionNames = existingPermissions.map(
        (p) => p.permission
      );

      const missingPermissions = defaultPermissions.filter(
        (perm) => !existingPermissionNames.includes(perm)
      );

      await Promise.all(
        missingPermissions.map((permissionName) =>
          Permission.create({
            roleId: role.id,
            permission: permissionName,
            isGranted: false,
          })
        )
      );
    }

    res.status(200).json({ message: "All roles updated with missing permissions." });
  } catch (error) {
    console.error("Error syncing role permissions:", error);
    res.status(500).json({ error: "Failed to sync role permissions." });
  }
};




