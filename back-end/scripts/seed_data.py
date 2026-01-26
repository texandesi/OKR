"""Seed script to populate the database with sample data."""

import asyncio
from datetime import date, timedelta

from sqlalchemy import select

from app.database import AsyncSessionLocal, create_tables
from app.models import (
    Group,
    KeyResult,
    Objective,
    ObjectiveOwnership,
    Organization,
    OwnerType,
    RecurringSchedule,
    Role,
    User,
)
from app.models.associations import (
    group_organizations,
    group_roles,
    user_groups,
    user_organizations,
    user_roles,
)


async def seed_database() -> None:
    """Seed the database with sample data."""
    await create_tables()

    async with AsyncSessionLocal() as db:
        # Check if data already exists
        existing_users = await db.execute(select(User))
        if existing_users.scalar_one_or_none():
            print("Database already has data. Skipping seed.")
            return

        print("Seeding database with sample data...")

        # ===================
        # CREATE ORGANIZATIONS
        # ===================
        org_university = Organization(
            name="Acme University", description="A fictional university for students and staff"
        )
        org_family = Organization(
            name="The Johnson Family", description="Family household organization"
        )
        org_roommates = Organization(
            name="Maple Street Roommates", description="Shared living arrangement"
        )
        orgs = [org_university, org_family, org_roommates]
        db.add_all(orgs)
        await db.flush()
        print(f"Created {len(orgs)} organizations")

        # ===================
        # CREATE ROLES (organization-scoped)
        # ===================
        # University roles
        role_admin = Role(name="Admin", description="System administrator with full access")
        role_professor = Role(name="Professor", description="Faculty member")
        role_ta = Role(name="Teaching Assistant", description="Graduate teaching assistant")
        role_student = Role(name="Student", description="Enrolled student")

        # Family roles
        role_parent = Role(name="Parent", description="Parent/guardian in family")
        role_child = Role(name="Child", description="Child in family")

        # Roommate roles
        role_chore_master = Role(name="Chore Master", description="Responsible for chore assignments")
        role_tenant = Role(name="Tenant", description="Apartment tenant")

        roles = [
            role_admin, role_professor, role_ta, role_student,
            role_parent, role_child,
            role_chore_master, role_tenant,
        ]
        db.add_all(roles)
        await db.flush()
        print(f"Created {len(roles)} roles")

        # ===================
        # CREATE USERS
        # ===================
        # University users
        user_admin = User(name="Admin", description="System administrator")
        user_prof_williams = User(name="Prof. Williams", description="CS Department professor")
        user_lisa = User(name="Lisa Martinez", description="Graduate teaching assistant")
        user_alex = User(name="Alex Chen", description="Graduate student in CS")
        user_jordan = User(name="Jordan Smith", description="Senior CS student")
        user_taylor = User(name="Taylor Brown", description="Junior CS student")

        # Family users
        user_sarah = User(name="Sarah Johnson", description="Mom - Family organizer")
        user_mike = User(name="Mike Johnson", description="Dad - Works from home")
        user_emma = User(name="Emma Johnson", description="Daughter - High school student")
        user_jake = User(name="Jake Johnson", description="Son - Middle school student")

        users = [
            user_admin, user_prof_williams, user_lisa, user_alex, user_jordan, user_taylor,
            user_sarah, user_mike, user_emma, user_jake,
        ]
        db.add_all(users)
        await db.flush()
        print(f"Created {len(users)} users")

        # ===================
        # CREATE GROUPS (organization-scoped)
        # ===================
        # University groups
        group_cs301 = Group(name="CS 301 Study Group", description="Distributed Systems project team")
        group_research = Group(name="Research Lab", description="Prof. Williams' research team")

        # Family groups
        group_household = Group(name="Johnson Household", description="Family chores and shared goals")
        group_kids = Group(name="Kids Team", description="Emma and Jake's shared responsibilities")

        # Roommate groups
        group_apartment = Group(name="Apartment 4B", description="Roommate shared responsibilities")

        groups = [group_cs301, group_research, group_household, group_kids, group_apartment]
        db.add_all(groups)
        await db.flush()
        print(f"Created {len(groups)} groups")

        # ===================================
        # ASSIGN USERS TO ORGANIZATIONS (1:1)
        # ===================================
        # University org members
        university_users = [user_admin, user_prof_williams, user_lisa, user_alex, user_jordan, user_taylor]
        for user in university_users:
            await db.execute(
                user_organizations.insert().values(
                    user_id=user.id, organization_id=org_university.id
                )
            )

        # Family org members
        family_users = [user_sarah, user_mike, user_emma, user_jake]
        for user in family_users:
            await db.execute(
                user_organizations.insert().values(
                    user_id=user.id, organization_id=org_family.id
                )
            )

        # Note: Roommates org has no dedicated users - Alex, Jordan, Taylor are university members
        # but could also be tenants. For simplicity, they stay in university org only.
        print("Assigned users to organizations (each user in exactly one org)")

        # ===================================
        # ASSIGN GROUPS TO ORGANIZATIONS (1:1)
        # ===================================
        # University groups
        for group in [group_cs301, group_research]:
            await db.execute(
                group_organizations.insert().values(
                    group_id=group.id, organization_id=org_university.id
                )
            )

        # Family groups
        for group in [group_household, group_kids]:
            await db.execute(
                group_organizations.insert().values(
                    group_id=group.id, organization_id=org_family.id
                )
            )

        # Roommate groups
        await db.execute(
            group_organizations.insert().values(
                group_id=group_apartment.id, organization_id=org_roommates.id
            )
        )
        print("Assigned groups to organizations (each group in exactly one org)")

        # ===================================
        # ASSIGN USERS TO ROLES
        # ===================================
        role_assignments = [
            # University role assignments
            (user_admin, role_admin),
            (user_prof_williams, role_professor),
            (user_lisa, role_ta),
            (user_lisa, role_student),  # Lisa is both TA and student
            (user_alex, role_student),
            (user_jordan, role_student),
            (user_taylor, role_student),

            # Family role assignments
            (user_sarah, role_parent),
            (user_mike, role_parent),
            (user_emma, role_child),
            (user_jake, role_child),

            # Roommate role assignments (for university students who are also tenants)
            (user_alex, role_tenant),
            (user_jordan, role_tenant),
            (user_jordan, role_chore_master),  # Jordan manages chores
            (user_taylor, role_tenant),
        ]
        for user, role in role_assignments:
            await db.execute(
                user_roles.insert().values(user_id=user.id, role_id=role.id)
            )
        print(f"Assigned {len(role_assignments)} user-role relationships")

        # ===================================
        # ASSIGN USERS TO GROUPS
        # ===================================
        group_memberships = [
            # CS 301 Study Group (university students)
            (user_alex, group_cs301),
            (user_jordan, group_cs301),
            (user_taylor, group_cs301),
            (user_lisa, group_cs301),  # Lisa helps with the course

            # Research Lab
            (user_prof_williams, group_research),
            (user_lisa, group_research),
            (user_alex, group_research),

            # Johnson Household (all family members)
            (user_sarah, group_household),
            (user_mike, group_household),
            (user_emma, group_household),
            (user_jake, group_household),

            # Kids Team (children only)
            (user_emma, group_kids),
            (user_jake, group_kids),

            # Apartment 4B (roommates)
            (user_alex, group_apartment),
            (user_jordan, group_apartment),
            (user_taylor, group_apartment),
        ]
        for user, group in group_memberships:
            await db.execute(
                user_groups.insert().values(user_id=user.id, group_id=group.id)
            )
        print(f"Assigned {len(group_memberships)} user-group relationships")

        # ===================================
        # ASSIGN ROLES TO GROUPS
        # ===================================
        group_role_assignments = [
            # CS 301 Study Group has student role
            (group_cs301, role_student),

            # Research Lab has professor, TA, and student roles
            (group_research, role_professor),
            (group_research, role_ta),
            (group_research, role_student),

            # Household has parent and child roles
            (group_household, role_parent),
            (group_household, role_child),

            # Kids Team has child role
            (group_kids, role_child),

            # Apartment has tenant and chore master roles
            (group_apartment, role_tenant),
            (group_apartment, role_chore_master),
        ]
        for group, role in group_role_assignments:
            await db.execute(
                group_roles.insert().values(group_id=group.id, role_id=role.id)
            )
        print(f"Assigned {len(group_role_assignments)} group-role relationships")

        # ===================
        # CREATE OBJECTIVES AND KEY RESULTS
        # ===================
        today = date.today()
        quarter_end = today + timedelta(days=90)
        month_end = today + timedelta(days=30)
        week_end = today + timedelta(days=7)

        # --- Family Objectives ---
        obj1 = Objective(
            name="Keep the House Clean",
            description="Maintain a tidy and organized home through shared responsibilities",
            start_date=today,
            end_date=quarter_end,
        )
        db.add(obj1)
        await db.flush()

        krs_obj1 = [
            KeyResult(
                name="Kitchen cleaned daily",
                description="Dishes done, counters wiped, floor swept",
                objective_id=obj1.id,
                target_value=7,
                current_value=5,
                unit="days/week",
            ),
            KeyResult(
                name="Bathrooms cleaned weekly",
                description="Deep clean all bathrooms once per week",
                objective_id=obj1.id,
                target_value=4,
                current_value=3,
                unit="bathrooms",
            ),
            KeyResult(
                name="Laundry completed",
                description="All family laundry washed, dried, and put away",
                objective_id=obj1.id,
                target_value=100,
                current_value=75,
                unit="%",
            ),
        ]
        db.add_all(krs_obj1)

        obj2 = Objective(
            name="Family Fitness Challenge",
            description="Get the whole family more active this quarter",
            start_date=today,
            end_date=quarter_end,
        )
        db.add(obj2)
        await db.flush()

        krs_obj2 = [
            KeyResult(
                name="Family walks per week",
                description="30-minute walks together as a family",
                objective_id=obj2.id,
                target_value=3,
                current_value=2,
                unit="walks",
            ),
            KeyResult(
                name="Screen-free dinner nights",
                description="Eat dinner together without devices",
                objective_id=obj2.id,
                target_value=5,
                current_value=3,
                unit="nights/week",
            ),
        ]
        db.add_all(krs_obj2)

        # --- Roommate Objectives ---
        obj3 = Objective(
            name="Apartment Chore Rotation",
            description="Fair distribution of cleaning tasks among roommates",
            start_date=today,
            end_date=month_end,
        )
        db.add(obj3)
        await db.flush()

        krs_obj3 = [
            KeyResult(
                name="Common areas cleaned",
                description="Living room and kitchen maintained daily",
                objective_id=obj3.id,
                target_value=100,
                current_value=80,
                unit="%",
            ),
            KeyResult(
                name="Trash taken out",
                description="Garbage and recycling taken to bins",
                objective_id=obj3.id,
                target_value=8,
                current_value=6,
                unit="times/month",
            ),
            KeyResult(
                name="Groceries shopping",
                description="Shared household supplies purchased",
                objective_id=obj3.id,
                target_value=4,
                current_value=2,
                unit="trips",
            ),
        ]
        db.add_all(krs_obj3)

        obj4 = Objective(
            name="Reduce Utility Bills",
            description="Cut down on electricity and water usage",
            start_date=today,
            end_date=quarter_end,
        )
        db.add(obj4)
        await db.flush()

        krs_obj4 = [
            KeyResult(
                name="Electricity reduction",
                description="Lower electric bill compared to last quarter",
                objective_id=obj4.id,
                target_value=15,
                current_value=8,
                unit="% reduction",
            ),
            KeyResult(
                name="Water usage reduction",
                description="Shorter showers and efficient appliance use",
                objective_id=obj4.id,
                target_value=10,
                current_value=5,
                unit="% reduction",
            ),
        ]
        db.add_all(krs_obj4)

        # --- Student Group Objectives ---
        obj5 = Objective(
            name="CS 301 Group Project",
            description="Complete the semester project on distributed systems",
            start_date=today,
            end_date=month_end,
        )
        db.add(obj5)
        await db.flush()

        krs_obj5 = [
            KeyResult(
                name="Backend API complete",
                description="All REST endpoints implemented and tested",
                objective_id=obj5.id,
                target_value=100,
                current_value=65,
                unit="%",
            ),
            KeyResult(
                name="Frontend UI complete",
                description="User interface design and implementation",
                objective_id=obj5.id,
                target_value=100,
                current_value=40,
                unit="%",
            ),
            KeyResult(
                name="Documentation written",
                description="Technical docs and user guide",
                objective_id=obj5.id,
                target_value=100,
                current_value=20,
                unit="%",
            ),
            KeyResult(
                name="Team meetings held",
                description="Weekly sync meetings completed",
                objective_id=obj5.id,
                target_value=4,
                current_value=3,
                unit="meetings",
            ),
        ]
        db.add_all(krs_obj5)

        # --- Research Lab Objectives ---
        obj6 = Objective(
            name="Q1 Research Publication",
            description="Submit paper to top-tier conference",
            start_date=today,
            end_date=quarter_end,
        )
        db.add(obj6)
        await db.flush()

        krs_obj6 = [
            KeyResult(
                name="Literature review",
                description="Review 50 related papers",
                objective_id=obj6.id,
                target_value=50,
                current_value=35,
                unit="papers",
            ),
            KeyResult(
                name="Experiments completed",
                description="Run all planned experiments",
                objective_id=obj6.id,
                target_value=100,
                current_value=60,
                unit="%",
            ),
            KeyResult(
                name="Paper draft",
                description="Complete first draft of paper",
                objective_id=obj6.id,
                target_value=100,
                current_value=45,
                unit="%",
            ),
        ]
        db.add_all(krs_obj6)

        # --- Kids Objectives ---
        obj7 = Objective(
            name="Homework & Chores Balance",
            description="Complete homework and help with house chores",
            start_date=today,
            end_date=week_end,
        )
        db.add(obj7)
        await db.flush()

        krs_obj7 = [
            KeyResult(
                name="Homework completed on time",
                description="All assignments turned in by deadline",
                objective_id=obj7.id,
                target_value=100,
                current_value=90,
                unit="%",
            ),
            KeyResult(
                name="Rooms cleaned",
                description="Keep bedrooms tidy",
                objective_id=obj7.id,
                target_value=7,
                current_value=4,
                unit="days",
            ),
            KeyResult(
                name="Pet care duties",
                description="Feed and walk the dog",
                objective_id=obj7.id,
                target_value=14,
                current_value=10,
                unit="times",
            ),
        ]
        db.add_all(krs_obj7)

        await db.flush()
        print("Created 7 objectives with key results")

        # ===================
        # CREATE OBJECTIVE OWNERSHIPS
        # ===================
        ownerships = [
            # Family objectives owned by Johnson Household group and Parent role
            ObjectiveOwnership(
                objective_id=obj1.id, owner_type=OwnerType.GROUP, owner_id=group_household.id
            ),
            ObjectiveOwnership(
                objective_id=obj1.id, owner_type=OwnerType.ROLE, owner_id=role_parent.id
            ),
            ObjectiveOwnership(
                objective_id=obj2.id, owner_type=OwnerType.GROUP, owner_id=group_household.id
            ),
            ObjectiveOwnership(
                objective_id=obj2.id, owner_type=OwnerType.USER, owner_id=user_sarah.id
            ),

            # Roommate objectives owned by Apartment group and Chore Master role
            ObjectiveOwnership(
                objective_id=obj3.id, owner_type=OwnerType.GROUP, owner_id=group_apartment.id
            ),
            ObjectiveOwnership(
                objective_id=obj3.id, owner_type=OwnerType.ROLE, owner_id=role_chore_master.id
            ),
            ObjectiveOwnership(
                objective_id=obj4.id, owner_type=OwnerType.GROUP, owner_id=group_apartment.id
            ),
            ObjectiveOwnership(
                objective_id=obj4.id, owner_type=OwnerType.ROLE, owner_id=role_tenant.id
            ),

            # Student project owned by study group
            ObjectiveOwnership(
                objective_id=obj5.id, owner_type=OwnerType.GROUP, owner_id=group_cs301.id
            ),
            ObjectiveOwnership(
                objective_id=obj5.id, owner_type=OwnerType.ROLE, owner_id=role_student.id
            ),

            # Research lab objective owned by lab group and professor
            ObjectiveOwnership(
                objective_id=obj6.id, owner_type=OwnerType.GROUP, owner_id=group_research.id
            ),
            ObjectiveOwnership(
                objective_id=obj6.id, owner_type=OwnerType.USER, owner_id=user_prof_williams.id
            ),
            ObjectiveOwnership(
                objective_id=obj6.id, owner_type=OwnerType.ROLE, owner_id=role_professor.id
            ),

            # Kids objective owned by kids team and child role
            ObjectiveOwnership(
                objective_id=obj7.id, owner_type=OwnerType.GROUP, owner_id=group_kids.id
            ),
            ObjectiveOwnership(
                objective_id=obj7.id, owner_type=OwnerType.ROLE, owner_id=role_child.id
            ),
        ]
        db.add_all(ownerships)
        print("Created objective ownerships")

        # ===================
        # CREATE RECURRING SCHEDULES
        # ===================
        await db.flush()

        # Daily kitchen cleaning - rotates between family members
        recurring1 = RecurringSchedule(
            key_result_id=krs_obj1[0].id,
            frequency="daily",
            rotation_enabled=True,
            rotation_users=[user_sarah.id, user_mike.id, user_emma.id, user_jake.id],
            current_rotation_index=0,
            next_due_date=today,
        )

        # Weekly bathroom cleaning - rotates between kids
        recurring2 = RecurringSchedule(
            key_result_id=krs_obj1[1].id,
            frequency="weekly",
            rotation_enabled=True,
            rotation_users=[user_emma.id, user_jake.id],
            current_rotation_index=0,
            next_due_date=today + timedelta(days=2),
        )

        # Trash rotation for roommates
        recurring3 = RecurringSchedule(
            key_result_id=krs_obj3[1].id,
            frequency="weekly",
            rotation_enabled=True,
            rotation_users=[user_alex.id, user_jordan.id, user_taylor.id],
            current_rotation_index=0,
            next_due_date=today,
        )

        # Weekly team meetings
        recurring4 = RecurringSchedule(
            key_result_id=krs_obj5[3].id,
            frequency="weekly",
            rotation_enabled=False,
            next_due_date=today + timedelta(days=3),
        )

        # Daily pet care - rotates between kids
        recurring5 = RecurringSchedule(
            key_result_id=krs_obj7[2].id,
            frequency="daily",
            rotation_enabled=True,
            rotation_users=[user_emma.id, user_jake.id],
            current_rotation_index=0,
            next_due_date=today,
        )

        db.add_all([recurring1, recurring2, recurring3, recurring4, recurring5])
        print("Created 5 recurring schedules")

        await db.commit()
        print("\n" + "=" * 50)
        print("Database seeding completed successfully!")
        print("=" * 50)
        print("\nSummary:")
        print(f"  - {len(orgs)} Organizations")
        print(f"  - {len(roles)} Roles")
        print(f"  - {len(users)} Users")
        print(f"  - {len(groups)} Groups")
        print("  - 7 Objectives with Key Results")
        print("  - 5 Recurring Schedules")
        print("\nRelationships:")
        print(f"  - {len(university_users)} users in Acme University")
        print(f"  - {len(family_users)} users in Johnson Family")
        print(f"  - {len(role_assignments)} user-role assignments")
        print(f"  - {len(group_memberships)} user-group memberships")
        print(f"  - {len(group_role_assignments)} group-role assignments")


if __name__ == "__main__":
    asyncio.run(seed_database())
