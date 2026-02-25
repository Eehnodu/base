import Button from "@/component/common/form/button";
import { ArrowRight, Home } from "lucide-react";

const ButtonArea = () => {
  return (
    <>
      <title>컴포넌트: 버튼</title>
      <section className="p-5 pr-7 flex flex-col border border-[#D3D3D3] rounded-md gap-5 h-fit">
        <div className="w-full flex items-center flex-row justify-center text-lg">
          <span className="font-bold">Main 버튼</span>
        </div>
        <section className="flex flex-col gap-3">
          <span>기본/HOVER/ACTIVE(MD)</span>
          <div className="flex flex-row gap-3">
            <Button>확인</Button>
            <Button className="bg-main-hover">HOVER</Button>
            <Button className="bg-main-active">ACTIVE</Button>
          </div>
        </section>
        <section className="flex flex-col gap-3">
          <span>기본 버튼(size)</span>
          <div className="flex flex-row gap-3 items-center">
            <Button size="sm">SM</Button>
            <Button>MD</Button>
            <Button size="lg">LG</Button>
          </div>
        </section>
        <section className="flex flex-col gap-3">
          <span>Left Icon(size)</span>
          <div className="flex flex-row gap-3 items-center">
            <Button leftIcon={<Home />} size="sm">
              SM
            </Button>
            <Button leftIcon={<Home />}>MD</Button>
            <Button leftIcon={<Home />} size="lg">
              LG
            </Button>
          </div>
        </section>
        <section className="flex flex-col gap-3">
          <span>Right Icon(size)</span>
          <div className="flex flex-row gap-3 items-center">
            <Button rightIcon={<ArrowRight />} size="sm">
              SM
            </Button>
            <Button rightIcon={<ArrowRight />}>MD</Button>
            <Button rightIcon={<ArrowRight />} size="lg">
              LG
            </Button>
          </div>
        </section>
        <section className="flex flex-col gap-3">
          <span>Left + Right Icon(size)</span>
          <div className="flex flex-row gap-3 items-center">
            <Button leftIcon={<Home />} rightIcon={<ArrowRight />} size="sm">
              SM
            </Button>
            <Button leftIcon={<Home />} rightIcon={<ArrowRight />}>
              MD
            </Button>
            <Button leftIcon={<Home />} rightIcon={<ArrowRight />} size="lg">
              LG
            </Button>
          </div>
        </section>
      </section>
      <section className="p-5 pr-7 flex flex-col border border-[#D3D3D3] rounded-md gap-5 h-fit">
        <div className="w-full flex items-center flex-row justify-center text-lg">
          <span className="font-bold">Sub 1 버튼</span>
        </div>
        <section className="flex flex-col gap-3">
          <span>기본/HOVER/ACTIVE(MD)</span>
          <div className="flex flex-row gap-3">
            <Button variant="sub1">확인</Button>
            <Button variant="sub1" className="bg-sub1-hover">
              HOVER
            </Button>
            <Button variant="sub1" className="bg-sub1-active">
              ACTIVE
            </Button>
          </div>
        </section>
        <section className="flex flex-col gap-3">
          <span>기본 버튼(size)</span>
          <div className="flex flex-row gap-3 items-center">
            <Button variant="sub1" size="sm">
              SM
            </Button>
            <Button variant="sub1">MD</Button>
            <Button variant="sub1" size="lg">
              LG
            </Button>
          </div>
        </section>
        <section className="flex flex-col gap-3">
          <span>Left Icon(size)</span>
          <div className="flex flex-row gap-3 items-center">
            <Button variant="sub1" leftIcon={<Home />} size="sm">
              SM
            </Button>
            <Button variant="sub1" leftIcon={<Home />}>
              MD
            </Button>
            <Button variant="sub1" leftIcon={<Home />} size="lg">
              LG
            </Button>
          </div>
        </section>
        <section className="flex flex-col gap-3">
          <span>Right Icon(size)</span>
          <div className="flex flex-row gap-3 items-center">
            <Button variant="sub1" rightIcon={<ArrowRight />} size="sm">
              SM
            </Button>
            <Button variant="sub1" rightIcon={<ArrowRight />}>
              MD
            </Button>
            <Button variant="sub1" rightIcon={<ArrowRight />} size="lg">
              LG
            </Button>
          </div>
        </section>
        <section className="flex flex-col gap-3">
          <span>Left + Right Icon(size)</span>
          <div className="flex flex-row gap-3 items-center">
            <Button
              variant="sub1"
              leftIcon={<Home />}
              rightIcon={<ArrowRight />}
              size="sm"
            >
              SM
            </Button>
            <Button
              variant="sub1"
              leftIcon={<Home />}
              rightIcon={<ArrowRight />}
            >
              MD
            </Button>
            <Button
              variant="sub1"
              leftIcon={<Home />}
              rightIcon={<ArrowRight />}
              size="lg"
            >
              LG
            </Button>
          </div>
        </section>
      </section>
      <section className="p-5 pr-7 flex flex-col border border-[#D3D3D3] rounded-md gap-5 h-fit">
        <div className="w-full flex items-center flex-row justify-center text-lg">
          <span className="font-bold">Sub 2 버튼</span>
        </div>
        <section className="flex flex-col gap-3">
          <span>기본/HOVER/ACTIVE(MD)</span>
          <div className="flex flex-row gap-3">
            <Button variant="sub2">확인</Button>
            <Button variant="sub2" className="bg-sub2-hover">
              HOVER
            </Button>
            <Button variant="sub2" className="bg-sub2-active">
              ACTIVE
            </Button>
          </div>
        </section>
        <section className="flex flex-col gap-3">
          <span>기본 버튼(size)</span>
          <div className="flex flex-row gap-3 items-center">
            <Button variant="sub2" size="sm">
              SM
            </Button>
            <Button variant="sub2">MD</Button>
            <Button variant="sub2" size="lg">
              LG
            </Button>
          </div>
        </section>
        <section className="flex flex-col gap-3">
          <span>Left Icon(size)</span>
          <div className="flex flex-row gap-3 items-center">
            <Button variant="sub2" leftIcon={<Home />} size="sm">
              SM
            </Button>
            <Button variant="sub2" leftIcon={<Home />}>
              MD
            </Button>
            <Button variant="sub2" leftIcon={<Home />} size="lg">
              LG
            </Button>
          </div>
        </section>
        <section className="flex flex-col gap-3">
          <span>Right Icon(size)</span>
          <div className="flex flex-row gap-3 items-center">
            <Button variant="sub2" rightIcon={<ArrowRight />} size="sm">
              SM
            </Button>
            <Button variant="sub2" rightIcon={<ArrowRight />}>
              MD
            </Button>
            <Button variant="sub2" rightIcon={<ArrowRight />} size="lg">
              LG
            </Button>
          </div>
        </section>
        <section className="flex flex-col gap-3">
          <span>Left + Right Icon(size)</span>
          <div className="flex flex-row gap-3 items-center">
            <Button
              variant="sub2"
              leftIcon={<Home />}
              rightIcon={<ArrowRight />}
              size="sm"
            >
              SM
            </Button>
            <Button
              variant="sub2"
              leftIcon={<Home />}
              rightIcon={<ArrowRight />}
            >
              MD
            </Button>
            <Button
              variant="sub2"
              leftIcon={<Home />}
              rightIcon={<ArrowRight />}
              size="lg"
            >
              LG
            </Button>
          </div>
        </section>
      </section>
    </>
  );
};

export default ButtonArea;
